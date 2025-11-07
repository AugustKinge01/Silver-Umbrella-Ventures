// Payment Escrow Contract for Silver Umbrella
// Handles plan purchases with secure escrow functionality

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, String, token};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Payment(u64),
}

#[derive(Clone)]
#[contracttype]
pub struct Payment {
    pub id: u64,
    pub buyer: Address,
    pub plan_id: String,
    pub amount: i128,
    pub status: Symbol,
    pub timestamp: u64,
}

#[contract]
pub struct PaymentContract;

#[contractimpl]
impl PaymentContract {
    /// Initialize contract with admin
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Create a new payment escrow for plan purchase
    pub fn create_payment(
        env: Env,
        buyer: Address,
        plan_id: String,
        amount: i128,
        token_address: Address,
    ) -> u64 {
        buyer.require_auth();

        let payment_id = env.ledger().sequence();
        
        // Transfer tokens to contract escrow
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&buyer, &env.current_contract_address(), &amount);

        let payment = Payment {
            id: payment_id,
            buyer: buyer.clone(),
            plan_id: plan_id.clone(),
            amount,
            status: Symbol::new(&env, "pending"),
            timestamp: env.ledger().timestamp(),
        };

        env.storage().instance().set(&DataKey::Payment(payment_id), &payment);
        
        env.events().publish(
            (Symbol::new(&env, "payment_created"), plan_id),
            (buyer, amount),
        );

        payment_id
    }

    /// Complete payment and issue voucher (admin only)
    pub fn complete_payment(env: Env, payment_id: u64, admin: Address) {
        admin.require_auth();
        
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Unauthorized");
        }

        let mut payment: Payment = env.storage()
            .instance()
            .get(&DataKey::Payment(payment_id))
            .unwrap();

        if payment.status != Symbol::new(&env, "pending") {
            panic!("Payment not pending");
        }

        payment.status = Symbol::new(&env, "completed");
        env.storage().instance().set(&DataKey::Payment(payment_id), &payment);

        env.events().publish(
            (Symbol::new(&env, "payment_completed"), payment_id),
            payment.buyer,
        );
    }

    /// Refund payment (admin only)
    pub fn refund_payment(
        env: Env,
        payment_id: u64,
        admin: Address,
        token_address: Address,
    ) {
        admin.require_auth();
        
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Unauthorized");
        }

        let mut payment: Payment = env.storage()
            .instance()
            .get(&DataKey::Payment(payment_id))
            .unwrap();

        if payment.status != Symbol::new(&env, "pending") {
            panic!("Payment not pending");
        }

        // Return tokens to buyer
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(
            &env.current_contract_address(),
            &payment.buyer,
            &payment.amount,
        );

        payment.status = Symbol::new(&env, "refunded");
        env.storage().instance().set(&DataKey::Payment(payment_id), &payment);

        env.events().publish(
            (Symbol::new(&env, "payment_refunded"), payment_id),
            payment.buyer,
        );
    }

    /// Get payment details
    pub fn get_payment(env: Env, payment_id: u64) -> Payment {
        env.storage()
            .instance()
            .get(&DataKey::Payment(payment_id))
            .unwrap()
    }
}
