// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import { VaultAPI } from "./BaseStrategy.sol";
import "./interfaces/IPrizePoolManager.sol";

contract PrizePool is Ownable {
    using Math for uint256;
    using SafeERC20 for IERC20;

    address public yieldProtocolAddress;
    IPrizePoolManager public prizePoolManager;
    IERC20 public depositToken;

    address public winner;
    uint256 public drawTime;
    uint256 public depositDeadline;

    mapping(address => uint256) deposits;
    mapping(uint256 => address) public index;

    uint256 public count;
    uint256 public totalDeposits;
    uint256 public totalInterest;

    VaultAPI public v;

    mapping(address => uint256) public depositTimes;
    mapping(address => uint256) public weightedTickets;
    uint256 public totalWeightedTickets;

    event Deposited(address indexed user, uint256 amount);
    event DepositedToYieldProtocol(uint256 amount);
    event WithdrawnFromYieldProtocol(uint256 amount);
    event Claimed(address indexed user, uint256 amount);
    event WinnerDrawn(address indexed winner);
    event DrawTimeUpdated(uint256 oldDrawTime, uint256 newDrawTime);
    event DepositDeadlineUpdated(uint256 oldDepositDeadline, uint256 newDepositDeadline);

    constructor(
        string memory name,
        string memory symbol,
        address _yieldProtocolAddress,
        address _token,
        address _poolManagerAddress,
        uint256 _drawDeadline,
        uint256 _depositDeadline,
        address _owner
    ) Ownable(_owner) {
        prizePoolManager = IPrizePoolManager(_poolManagerAddress);
        drawTime = block.timestamp + _drawDeadline;
        depositDeadline = block.timestamp + _depositDeadline;
        yieldProtocolAddress = _yieldProtocolAddress;
        depositToken = IERC20(_token);
        count = 0;
        // v = VaultAPI(yieldProtocolAddress);
    }

    //
    // CORE EXTERNAL FUNCTIONS
    //

    function deposit(uint256 amount) external returns (uint256) {
        require(block.timestamp < depositDeadline, "Deposit deadline has passed");
        require(amount > 0, "Amount must be greater than 0");

        // Record deposit time for new deposits
        if (deposits[msg.sender] == 0) {
            index[count] = msg.sender;
            count += 1;
            depositTimes[msg.sender] = block.timestamp;
        }

        // Transfer tokens from user to this contract
        depositToken.safeTransferFrom(msg.sender, address(this), amount);

        totalDeposits += amount;
        deposits[msg.sender] += amount;

        // Calculate weighted tickets based on deposit amount and time
        // Earlier deposits get more weight (depositDeadline - depositTime)
        uint256 timeWeight = depositDeadline - depositTimes[msg.sender];

        // Remove old weighted tickets from total
        totalWeightedTickets -= weightedTickets[msg.sender];

        // Calculate new weighted tickets: deposit amount * time weight
        // Use SafeMath or a safer calculation approach
        if (deposits[msg.sender] > 0 && timeWeight > 0) {
            // Option 1: Use a scaling factor to prevent overflow
            uint256 scaledDeposit = deposits[msg.sender] / 1e9; // Scale down large deposits
            weightedTickets[msg.sender] = scaledDeposit * timeWeight;

            // Option 2: Alternative approach using division first
            // weightedTickets[msg.sender] = deposits[msg.sender] / (type(uint256).max / timeWeight);
        } else {
            weightedTickets[msg.sender] = 0;
        }

        // Add new weighted tickets to total
        totalWeightedTickets += weightedTickets[msg.sender];

        emit Deposited(msg.sender, amount);

        return deposits[msg.sender];
    }

    function withdraw() external {
        require(block.timestamp >= drawTime, "Withdrawal time not started yet.");
        require(winner != address(0), "Winner not drawn yet");

        uint256 userDeposit = deposits[msg.sender];
        require(userDeposit > 0, "You have not deposited any amount.");

        totalDeposits -= userDeposit;
        deposits[msg.sender] = 0;

        uint256 totalClaimAmount = userDeposit;
        if (isWinner(msg.sender)) {
            totalClaimAmount = totalClaimAmount + totalInterest;
        }

        // Transfer tokens back to user
        depositToken.safeTransfer(msg.sender, totalClaimAmount);

        emit Claimed(msg.sender, totalClaimAmount);
    }

    //
    // ADMIN FUNCTIONS
    //

    function updateDrawTime(uint256 _newDrawTime) external onlyOwner {
        require(winner == address(0), "Winner already drawn");
        require(_newDrawTime > block.timestamp, "New draw time must be in the future");
        uint256 oldDrawTime = drawTime;
        drawTime = _newDrawTime;
        emit DrawTimeUpdated(oldDrawTime, _newDrawTime);
    }

    function updateDepositDeadline(uint256 _newDepositDeadline) external onlyOwner {
        require(_newDepositDeadline > block.timestamp, "New deposit deadline must be in the future");
        uint256 oldDepositDeadline = depositDeadline;
        depositDeadline = _newDepositDeadline;
        emit DepositDeadlineUpdated(oldDepositDeadline, _newDepositDeadline);
    }

    function drawWinner() external onlyOwner returns (address) {
        require(block.timestamp >= depositDeadline, "Not yet time to draw winner");
        require(winner == address(0), "Winner already drawn");
        require(totalWeightedTickets > 0, "No weighted tickets");

        // Generate a random number between 0 and totalWeightedTickets
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) %
            totalWeightedTickets;

        // Find the winner based on weighted tickets
        uint256 ticketSum = 0;
        for (uint256 i = 0; i < count; i++) {
            address participant = index[i];
            ticketSum += weightedTickets[participant];

            if (randomNumber < ticketSum) {
                winner = participant;
                break;
            }
        }

        require(winner != address(0), "Failed to select winner");

        emit WinnerDrawn(winner);
        return winner;
    }

    // //
    // // YIELD FUNCTIONS
    // //

    // // Function to deposit tokens to yield protocol (for potential future implementation)
    // function depositToYieldProtocol(uint256 amount) external onlyOwner {
    //     require(amount > 0 && amount <= depositToken.balanceOf(address(this)), "Invalid amount");

    //     // Approve yield protocol to spend tokens
    //     depositToken.approve(yieldProtocolAddress, amount);

    //     // Implementation would depend on the specific yield protocol
    //     // v.deposit(amount);

    //     emit DepositedToYieldProtocol(amount);
    // }

    // // Function to withdraw tokens from yield protocol (for potential future implementation)
    // function withdrawFromYieldProtocol(uint256 amount) external onlyOwner {
    //     require(amount > 0, "Invalid amount");

    //     // Implementation would depend on the specific yield protocol
    //     // v.withdraw(amount);

    //     // Track interest earned
    //     // totalInterest = depositToken.balanceOf(address(this)) - totalDeposits;

    //     emit WithdrawnFromYieldProtocol(amount);
    // }

    //
    // VIEW FUNCTIONS
    //

    function isWinner(address account) public view returns (bool) {
        return winner == account;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function getWinRate(address user) public view returns (uint256) {
        if (totalWeightedTickets == 0) return 0;

        // Use 1,000,000 (10^6) instead of 10,000 (10^4) for 4 additional decimal places
        // This represents the win rate in parts per million instead of basis points
        return (weightedTickets[user] * 1000000) / totalWeightedTickets;
    }
}
