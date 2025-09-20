
// subgraph/src/mapping.ts
import { BigInt, BigDecimal, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  PrizePoolCreated
} from "../generated/PrizePoolManager/PrizePoolManager"
import {
  Deposited,
  WinnerDrawn,
  Claimed,
  DepositDeadlineUpdated,
  DrawTimeUpdated
} from "../generated/templates/PrizePool/PrizePool"
import { Raffle, Player, RaffleDeposit, Withdrawal, PlayerRaffleStats, WinnerDrawnEvent, DepositDeadlineUpdatedEvent, DrawTimeUpdatedEvent } from "../generated/schema" // ADD DepositedToYieldProtocolEvent, WithdrawnFromYieldProtocolEvent LATER
import { PrizePool as PrizePoolTemplate } from "../generated/templates"
import { ERC20 } from "../generated/templates/PrizePool/ERC20"
import { PrizePool } from "../generated/templates/PrizePool/PrizePool" // ADD DepositedToYieldProtocol, WithdrawnFromYieldProtocol LATER

    
export function handlePrizePoolCreated(event: PrizePoolCreated): void {
  let raffle = new Raffle(event.params.prizePoolAddress.toHexString())
  raffle.name = event.params.name
  raffle.symbol = event.params.symbol
  raffle.createdAt = event.block.timestamp
  raffle.tokenAddress = event.params.tokenAddress
  raffle.depositDeadline = event.params.depositionDeadline
  raffle.drawTime = event.params.withdrawalTime
  raffle.totalDeposits = BigDecimal.fromString("0")
  raffle.totalWeightedTickets = BigDecimal.fromString("0")
  raffle.participantCount = BigInt.fromI32(0)
  raffle.participants = []
  raffle.status = "IN_PROGRESS"
  raffle.totalPrizePool = BigDecimal.fromString("0")
  // --- Get Token Decimals ---
  let tokenContract = ERC20.bind(Address.fromBytes(raffle.tokenAddress))
  let tokenDecimals = BigInt.fromI32(18)
  let tokenDecimalsResult = tokenContract.try_decimals()
  if (!tokenDecimalsResult.reverted) {
    tokenDecimals = BigInt.fromI32(tokenDecimalsResult.value)
  }
  raffle.decimals = tokenDecimals
  raffle.save()

  PrizePoolTemplate.create(event.params.prizePoolAddress)
}
    
export function handleDeposited(event: Deposited): void {
  let raffleId = event.address.toHexString()
  let raffle = Raffle.load(raffleId)
  if (!raffle) return

  let playerId = event.params.user.toHexString()
  let player = Player.load(playerId)

  if (!player) {
    player = new Player(playerId)
    player.totalDeposited = BigDecimal.fromString("0")
    player.firstDepositTimestamp = event.block.timestamp
  }

  // --- PlayerRaffleStats: Load or Create ---
  let playerRaffleStatsId = playerId + "-" + raffleId
  let playerRaffleStats = PlayerRaffleStats.load(playerRaffleStatsId)

  if (!playerRaffleStats) {
    playerRaffleStats = new PlayerRaffleStats(playerRaffleStatsId)
    playerRaffleStats.player = playerId
    playerRaffleStats.raffle = raffleId
    playerRaffleStats.totalDepositedInRaffle = BigDecimal.fromString("0")
    playerRaffleStats.weightedTicketsInRaffle = BigDecimal.fromString("0")
    playerRaffleStats.wonRaffle = false // Initialize
  }

  // --- Calculate Weighted Tickets ---
  // This calculation must precisely match the contract's logic.
  // Contract: timeWeight = depositDeadline - depositTimes[msg.sender]
  // Contract: scaledDeposit = deposits[msg.sender] / 1e9
  // Contract: weightedTickets[msg.sender] = scaledDeposit * timeWeight

  // Bind to the PrizePool contract using its generated type
  let prizePoolContract = PrizePool.bind(event.address)
  // Get the exact `deposits[msg.sender]` value from the contract at this block.
  // Use try_deposits() to handle potential reverts and check for success
  let userDepositInThisRaffleRawResult = prizePoolContract.try_deposits(event.params.user)
  let userDepositInThisRaffle: BigDecimal // Declare as BigDecimal
  if (!userDepositInThisRaffleRawResult.reverted) { // Check if call reverted
    userDepositInThisRaffle = userDepositInThisRaffleRawResult.value.toBigDecimal().div(BigInt.fromI32(10).pow(raffle.decimals.toI32() as u8).toBigDecimal())
  } else {
    userDepositInThisRaffle = BigDecimal.fromString("0") // Default if call reverts
  }

  // 2.Calculate timeWeight
  let timeWeight: BigInt
  // Ensure depositDeadline is greater than player's firstDepositTimestamp
  if (raffle.depositDeadline.gt(player.firstDepositTimestamp)) {
    timeWeight = raffle.depositDeadline.minus(player.firstDepositTimestamp)
  } else {
    timeWeight = BigInt.fromI32(0)
  }
  let timeWeightBigDecimal = BigDecimal.fromString(timeWeight.toString())

  // 3. Calculate scaledDeposit (using userDepositInThisRaffle)
  let scaledDeposit = userDepositInThisRaffle.div(BigDecimal.fromString("1000000000")) // 1e9

  // 4. Calculate weightedAmount for this deposit
  let weightedAmount = scaledDeposit.times(timeWeightBigDecimal)

  // --- This logic runs on EVERY deposit ---
  // 1. Create a new RaffleDeposit entity to record this specific transaction.
  let depositId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let newDeposit = new RaffleDeposit(depositId)
  newDeposit.raffle = raffleId
  newDeposit.player = playerId
  // --- Use raffle.decimals for division ---
  let divisor = BigInt.fromI32(10).pow(raffle.decimals.toI32() as u8).toBigDecimal()
  newDeposit.amount = event.params.amount.toBigDecimal().div(divisor) // This is the current deposit amount
  newDeposit.weightedAmount = weightedAmount
  newDeposit.timestamp = event.block.timestamp
  newDeposit.save()

  // 2. Add the deposited amount to the raffle's total.
  raffle.totalDeposits = raffle.totalDeposits.plus(newDeposit.amount)
  raffle.totalWeightedTickets = raffle.totalWeightedTickets.plus(newDeposit.weightedAmount)

  // 3. Add the deposited amount to the player's lifetime total (global sum)
  player.totalDeposited = player.totalDeposited.plus(newDeposit.amount)

  // --- This logic runs ONLY on a player's FIRST deposit to THIS raffle ---
  let participants = raffle.participants // Get the current list of unique participants for this raffle
  if (participants.indexOf(playerId) == -1) { // Check if the current user's address is already in the list
    // 2. If it's not there, it's their first time. Add their address to the list.
    participants.push(playerId)
    raffle.participants = participants // Update the raffle's participants list
    // 3. And increment the unique participant count for the raffle.
    raffle.participantCount = raffle.participantCount.plus(BigInt.fromI32(1))
  }
  // --- Update PlayerRaffleStats ---
  playerRaffleStats.totalDepositedInRaffle = playerRaffleStats.totalDepositedInRaffle.plus(newDeposit.amount)
  playerRaffleStats.weightedTicketsInRaffle = playerRaffleStats.weightedTicketsInRaffle.plus(newDeposit.weightedAmount)
  // Calculate winChance
  if (raffle.totalWeightedTickets.gt(BigDecimal.fromString("0"))) {
    playerRaffleStats.winChance = playerRaffleStats.weightedTicketsInRaffle.div(raffle.totalWeightedTickets).times(BigDecimal.fromString("100"))
  } else {
    playerRaffleStats.winChance = BigDecimal.fromString("0")
  }
  playerRaffleStats.save() // Save the new entity

  // --- Save all the updated entities once at the end ---
  raffle.save()
  player.save()
}

    
export function handleWinnerDrawn(event: WinnerDrawn): void {
  let raffle = Raffle.load(event.address.toHexString())
  if (raffle) {
    raffle.winner = event.params.winner.toHexString()
    raffle.status = "COMPLETED"
    raffle.save()

    // Create WinnerDrawnEvent entity
  let winnerDrawnEvent = new WinnerDrawnEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  winnerDrawnEvent.raffle = raffle.id
  winnerDrawnEvent.player = event.params.winner.toHexString() // The winner is the player for this event 
  winnerDrawnEvent.winner = event.params.winner.toHexString()
  winnerDrawnEvent.timestamp = event.block.timestamp
  winnerDrawnEvent.save()
  }

  // Update PlayerRaffleStats for the winner
  let winnerId = event.params.winner.toHexString()
  let playerRaffleStatsId = winnerId + "-" + raffle!.id
  let winnerRaffleStats = PlayerRaffleStats.load(playerRaffleStatsId)
  if (winnerRaffleStats) {
    winnerRaffleStats.wonRaffle = true
    winnerRaffleStats.save()
  }
}

export function handleClaimed(event: Claimed): void {
  let raffleId = event.address.toHexString()
  let raffle = Raffle.load(raffleId)
  if (!raffle) return

  let playerId = event.params.user.toHexString()
  let player = Player.load(playerId)
  if (!player) {
    // This should ideally not happen if player deposited before claiming
    player = new Player(playerId)
    player.totalDeposited = BigDecimal.fromString("0")
    player.save()
  }

  let withdrawal = new Withdrawal(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  withdrawal.raffle = raffleId
  withdrawal.player = playerId
  // --- Use raffle.decimals for division ---
  let divisor = BigInt.fromI32(10).pow(raffle.decimals.toI32() as u8).toBigDecimal()
  withdrawal.amount = event.params.amount.toBigDecimal().div(divisor)
  withdrawal.timestamp = event.block.timestamp
  withdrawal.save()

  // Mirror contract's totalDeposits -= userDeposit;
  raffle.totalDeposits = raffle.totalDeposits.minus(withdrawal.amount)
  raffle.save()

  // You might want to track total withdrawn amount on Raffle or Player entities here
  // For example: raffle.totalWithdrawn = raffle.totalWithdrawn.plus(withdrawal.amount)
  // player.totalWithdrawn = player.totalWithdrawn.plus(withdrawal.amount)
  // Remember to add these fields to your schema first if you want to track them.

}

export function handleDepositDeadlineUpdated(event: DepositDeadlineUpdated): void {
  let raffle = Raffle.load(event.address.toHexString())
  if (raffle) {
    raffle.depositDeadline = event.params.newDepositDeadline
    raffle.save()

    // Create DepositDeadlineUpdatedEvent entity
    let updateEvent = new DepositDeadlineUpdatedEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
    updateEvent.raffle = raffle.id
    updateEvent.player = event.transaction.from.toHexString() // The sender of the transaction is the player
    updateEvent.oldDepositDeadline = event.params.oldDepositDeadline
    updateEvent.newDepositDeadline = event.params.newDepositDeadline
    updateEvent.timestamp = event.block.timestamp
    updateEvent.save()
  }
}

export function handleDrawTimeUpdated(event: DrawTimeUpdated): void {
  let raffle = Raffle.load(event.address.toHexString())
  if (raffle) {
    raffle.drawTime = event.params.newDrawTime
    raffle.save()

    // Create DrawTimeUpdatedEvent entity
    let updateEvent = new DrawTimeUpdatedEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
    updateEvent.raffle = raffle.id
    updateEvent.player = event.transaction.from.toHexString() // The sender of the transaction is the player
    updateEvent.oldDrawTime = event.params.oldDrawTime
    updateEvent.newDrawTime = event.params.newDrawTime
    updateEvent.timestamp = event.block.timestamp
    updateEvent.save()
  
  }
}

// --- NEW PLACEHOLDER EVENT HANDLERS FOR YIELD PROTOCOL ---
// export function handleDepositedToYieldProtocol(event: DepositedToYieldProtocol): void { 
//   let raffle = Raffle.load(event.address.toHexString())
//   if (!raffle) return
//   // TODO: Implement logic to update raffle.totalPrizePool here
//   // This event is emitted by the contract when funds are deposited to the yield protocol.
//   // You'll need to decide how 'amount' in the event relates to totalPrizePool.
//   // Example (if 'amount' is the new total):
//   // raffle.totalPrizePool = event.params.amount.toBigDecimal().div(BigInt.fromI32(10).pow(raffle.decimals.toI32() as u8).toBigDecimal())
//   // Example (if 'amount' is an increment):
//   // raffle.totalPrizePool = raffle.totalPrizePool.plus(event.params.amount.toBigDecimal().div(BigInt.fromI32(10).pow(raffle.decimals.toI32() as u8).toBigDecimal()))

//   // Create an event entity for this
//   let yieldDepositEvent = new DepositedToYieldProtocolEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
//   yieldDepositEvent.raffle = raffle.id
//   yieldDepositEvent.player = event.transaction.from.toHexString() // Assuming owner is sender
//   yieldDepositEvent.amount = event.params.amount.toBigDecimal().div(BigInt.fromI32(10).pow(raffle.decimals.toI32()).toBigDecimal())
//   yieldDepositEvent.timestamp = event.block.timestamp
//   yieldDepositEvent.save()

//   raffle.save() // Save raffle if totalPrizePool was updated
// }

// export function handleWithdrawnFromYieldProtocol(event: WithdrawnFromYieldProtocol): void {
//   let raffle = Raffle.load(event.address.toHexString())
//   if (!raffle) return

//   // TODO: Implement logic to update raffle.totalPrizePool here
//   // This event is emitted by the contract when funds are withdrawn from the yield protocol.
//   // Example (if 'amount' is a decrement):
//   // raffle.totalPrizePool = raffle.totalPrizePool.minus(event.params.amount.toBigDecimal().div(BigInt.fromI32(10).pow(raffle.decimals.toI32() as u8).toBigDecimal()))
//   // Create an event entity for this

//   let yieldWithdrawalEvent = new WithdrawnFromYieldProtocolEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
//   yieldWithdrawalEvent.raffle = raffle.id
//   yieldWithdrawalEvent.player = event.transaction.from.toHexString() // Assuming owner is sender
//   yieldWithdrawalEvent.amount = event.params.amount.toBigDecimal().div(BigInt.fromI32(10).pow(raffle.decimals.toI32()).toBigDecimal())
//   yieldWithdrawalEvent.timestamp = event.block.timestamp
//   yieldWithdrawalEvent.save()

//   raffle.save() // Save raffle if totalPrizePool was updated
// }