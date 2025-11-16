// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Payment Escrow Contract
 * @dev Handles plan purchases with secure escrow functionality for Silver Umbrella
 * Supports native token (ONE) and ERC20 token (INET) payments
 */
contract PaymentEscrow is Ownable, ReentrancyGuard {
    uint256 private paymentCounter;

    enum PaymentStatus { Pending, Completed, Refunded }

    struct Payment {
        uint256 id;
        address buyer;
        string planId;
        uint256 amount;
        address tokenAddress; // address(0) for native token, otherwise ERC20
        PaymentStatus status;
        uint256 timestamp;
    }

    mapping(uint256 => Payment) public payments;

    event PaymentCreated(
        uint256 indexed id,
        address indexed buyer,
        string planId,
        uint256 amount,
        address tokenAddress
    );
    event PaymentCompleted(uint256 indexed id);
    event PaymentRefunded(uint256 indexed id);

    constructor() Ownable(msg.sender) {
        paymentCounter = 0;
    }

    /**
     * @dev Create a new payment (escrow)
     * @param planId Unique identifier for the plan
     * @param amount Amount to be paid
     * @param tokenAddress Token contract address (address(0) for native token)
     */
    function createPayment(
        string memory planId,
        uint256 amount,
        address tokenAddress
    ) external payable nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(planId).length > 0, "Plan ID cannot be empty");

        if (tokenAddress == address(0)) {
            // Native token payment
            require(msg.value == amount, "Incorrect payment amount");
        } else {
            // ERC20 token payment
            require(msg.value == 0, "Do not send native token for ERC20 payment");
            IERC20 token = IERC20(tokenAddress);
            require(
                token.transferFrom(msg.sender, address(this), amount),
                "Token transfer failed"
            );
        }

        paymentCounter++;
        payments[paymentCounter] = Payment({
            id: paymentCounter,
            buyer: msg.sender,
            planId: planId,
            amount: amount,
            tokenAddress: tokenAddress,
            status: PaymentStatus.Pending,
            timestamp: block.timestamp
        });

        emit PaymentCreated(paymentCounter, msg.sender, planId, amount, tokenAddress);
        return paymentCounter;
    }

    /**
     * @dev Complete a payment (admin only)
     * @param paymentId ID of the payment to complete
     */
    function completePayment(uint256 paymentId) external onlyOwner nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.id != 0, "Payment does not exist");
        require(payment.status == PaymentStatus.Pending, "Payment not pending");

        payment.status = PaymentStatus.Completed;

        // Transfer funds to owner
        if (payment.tokenAddress == address(0)) {
            // Native token
            (bool success, ) = owner().call{value: payment.amount}("");
            require(success, "Transfer failed");
        } else {
            // ERC20 token
            IERC20 token = IERC20(payment.tokenAddress);
            require(
                token.transfer(owner(), payment.amount),
                "Token transfer failed"
            );
        }

        emit PaymentCompleted(paymentId);
    }

    /**
     * @dev Refund a payment (admin only)
     * @param paymentId ID of the payment to refund
     */
    function refundPayment(uint256 paymentId) external onlyOwner nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.id != 0, "Payment does not exist");
        require(payment.status == PaymentStatus.Pending, "Payment not pending");

        payment.status = PaymentStatus.Refunded;

        // Refund to buyer
        if (payment.tokenAddress == address(0)) {
            // Native token
            (bool success, ) = payment.buyer.call{value: payment.amount}("");
            require(success, "Refund failed");
        } else {
            // ERC20 token
            IERC20 token = IERC20(payment.tokenAddress);
            require(
                token.transfer(payment.buyer, payment.amount),
                "Token refund failed"
            );
        }

        emit PaymentRefunded(paymentId);
    }

    /**
     * @dev Get payment details
     * @param paymentId ID of the payment
     */
    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        require(payments[paymentId].id != 0, "Payment does not exist");
        return payments[paymentId];
    }

    /**
     * @dev Get total number of payments
     */
    function getPaymentCount() external view returns (uint256) {
        return paymentCounter;
    }
}
