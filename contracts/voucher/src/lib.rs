// Voucher NFT Contract for Silver Umbrella
// Manages plan voucher minting and redemption

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Voucher(u64),
    NextId,
}

#[derive(Clone)]
#[contracttype]
pub struct Voucher {
    pub id: u64,
    pub owner: Address,
    pub plan_id: String,
    pub code: String,
    pub is_active: bool,
    pub activated_at: Option<u64>,
    pub expires_at: u64,
    pub duration_hours: u32,
}

#[contract]
pub struct VoucherContract;

#[contractimpl]
impl VoucherContract {
    /// Initialize contract with admin
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NextId, &1u64);
    }

    /// Mint a new voucher (admin only)
    pub fn mint_voucher(
        env: Env,
        admin: Address,
        owner: Address,
        plan_id: String,
        code: String,
        duration_hours: u32,
    ) -> u64 {
        admin.require_auth();
        
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Unauthorized");
        }

        let voucher_id: u64 = env.storage().instance().get(&DataKey::NextId).unwrap();
        
        let voucher = Voucher {
            id: voucher_id,
            owner: owner.clone(),
            plan_id: plan_id.clone(),
            code: code.clone(),
            is_active: false,
            activated_at: None,
            expires_at: env.ledger().timestamp() + (duration_hours as u64 * 3600),
            duration_hours,
        };

        env.storage().instance().set(&DataKey::Voucher(voucher_id), &voucher);
        env.storage().instance().set(&DataKey::NextId, &(voucher_id + 1));

        env.events().publish(
            (Symbol::new(&env, "voucher_minted"), voucher_id),
            (owner, plan_id, code),
        );

        voucher_id
    }

    /// Activate a voucher
    pub fn activate_voucher(env: Env, voucher_id: u64, owner: Address) {
        owner.require_auth();

        let mut voucher: Voucher = env.storage()
            .instance()
            .get(&DataKey::Voucher(voucher_id))
            .unwrap();

        if voucher.owner != owner {
            panic!("Not voucher owner");
        }

        if voucher.is_active {
            panic!("Voucher already active");
        }

        if env.ledger().timestamp() > voucher.expires_at {
            panic!("Voucher expired");
        }

        voucher.is_active = true;
        voucher.activated_at = Some(env.ledger().timestamp());
        
        env.storage().instance().set(&DataKey::Voucher(voucher_id), &voucher);

        env.events().publish(
            (Symbol::new(&env, "voucher_activated"), voucher_id),
            owner,
        );
    }

    /// Get voucher details
    pub fn get_voucher(env: Env, voucher_id: u64) -> Voucher {
        env.storage()
            .instance()
            .get(&DataKey::Voucher(voucher_id))
            .unwrap()
    }

    /// Check if voucher is valid
    pub fn is_valid(env: Env, voucher_id: u64) -> bool {
        let voucher: Voucher = env.storage()
            .instance()
            .get(&DataKey::Voucher(voucher_id))
            .unwrap();

        if !voucher.is_active {
            return false;
        }

        if env.ledger().timestamp() > voucher.expires_at {
            return false;
        }

        true
    }

    /// Transfer voucher to new owner
    pub fn transfer(env: Env, voucher_id: u64, from: Address, to: Address) {
        from.require_auth();

        let mut voucher: Voucher = env.storage()
            .instance()
            .get(&DataKey::Voucher(voucher_id))
            .unwrap();

        if voucher.owner != from {
            panic!("Not voucher owner");
        }

        if voucher.is_active {
            panic!("Cannot transfer active voucher");
        }

        voucher.owner = to.clone();
        env.storage().instance().set(&DataKey::Voucher(voucher_id), &voucher);

        env.events().publish(
            (Symbol::new(&env, "voucher_transferred"), voucher_id),
            (from, to),
        );
    }
}
