// subgraph/src/mapping.ts

import { BigInt } from "@graphprotocol/graph-ts"
import {
  Deposited,
  WinnerDrawn,
} from "../generated/PrizePool/PrizePool"
import { Raffle, Player, Deposit } from "../generated/schema"

export function handleDeposited(event: Deposited): void {
  let raffle = Raffle.load(event.address.toHex())
  if (raffle == null) {
    // This should not happen if the contract is created correctly
    return
  }

  let player = Player.load(event.params.user.toHex())
  if (player == null) {
    player = new Player(event.params.user.toHex())
    player.address = event.params.user
    player.save()
  }

  let deposit = new Deposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  deposit.raffle = raffle.id
  deposit.player = player.id
  deposit.amount = event.params.amount
  deposit.timestamp = event.block.timestamp
  deposit.save()

  raffle.ticketsSold = raffle.ticketsSold.plus(BigInt.fromI32(1))
  raffle.prizePool = raffle.prizePool.plus(event.params.amount)
  raffle.save()
}

export function handleWinnerDrawn(event: WinnerDrawn): void {
  let raffle = Raffle.load(event.address.toHex())
  if (raffle == null) {
    return
  }

  let player = Player.load(event.params.winner.toHex())
  if (player == null) {
    // This should not happen if the winner has deposited
    player = new Player(event.params.winner.toHex())
    player.address = event.params.winner
    player.save()
  }

  raffle.winner = player.id
  raffle.status = "completed"
  raffle.save()
}
