// Payment Escrow Module - OneChain Move Contract
module payment::escrow {
    use one::object::{Self, ID, UID};
    use one::tx_context::{Self, TxContext};
    use one::transfer;
    use one::coin::{Self, Coin};
    use one::oct::OCT;
    use one::event;
    use std::string::{Self, String};

    /// Payment record
    struct Payment has key, store {
        id: UID,
        buyer: address,
        plan_id: String,
        amount: u64,
        status: u8, // 0: pending, 1: completed
        timestamp: u64,
    }

    /// Event emitted when payment is created
    struct PaymentCreated has copy, drop {
        payment_id: ID,
        buyer: address,
        plan_id: String,
        amount: u64,
    }

    /// Event emitted when payment is completed
    struct PaymentCompleted has copy, drop {
        payment_id: ID,
    }

    /// Create a new payment
    public entry fun create_payment(
        payment_coin: Coin<OCT>,
        plan_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment_coin);
        let sender = tx_context::sender(ctx);
        
        let payment = Payment {
            id: object::new(ctx),
            buyer: sender,
            plan_id: string::utf8(plan_id),
            amount,
            status: 0,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
        };

        let payment_id = object::id(&payment);
        
        // Emit event
        event::emit(PaymentCreated {
            payment_id,
            buyer: sender,
            plan_id: string::utf8(plan_id),
            amount,
        });

        // Transfer payment to contract (it will be held)
        transfer::public_transfer(payment_coin, @payment);
        
        // Transfer payment object to buyer
        transfer::transfer(payment, sender);
    }

    /// Complete a payment (admin only in production)
    public entry fun complete_payment(
        payment: Payment,
        ctx: &mut TxContext
    ) {
        let Payment { id, buyer: _, plan_id: _, amount: _, status: _, timestamp: _ } = payment;
        let payment_id = object::uid_to_inner(&id);
        
        event::emit(PaymentCompleted {
            payment_id,
        });
        
        object::delete(id);
    }
}
