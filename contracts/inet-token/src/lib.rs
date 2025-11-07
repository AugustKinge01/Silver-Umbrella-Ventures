// INET Token Contract - Internet Bandwidth Credits for Silver Umbrella
// Stellar Asset Contract (SAC) for managing internet access tokens

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String};

#[contract]
pub struct InetToken;

#[contractimpl]
impl InetToken {
    /// Initialize the INET token
    pub fn initialize(
        env: Env,
        admin: Address,
        decimal: u32,
        name: String,
        symbol: String,
    ) {
        let token_client = token::StellarAssetClient::new(&env, &env.current_contract_address());
        token_client.set_admin(&admin);
        
        let token_admin_client = token::TokenClient::new(&env, &env.current_contract_address());
        token_admin_client.set_admin(&admin);

        env.events().publish(
            (soroban_sdk::symbol_short!("init"),),
            (name, symbol, decimal),
        );
    }

    /// Mint new INET tokens (admin only)
    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&soroban_sdk::symbol_short!("admin")).unwrap();
        admin.require_auth();

        let token_client = token::Client::new(&env, &env.current_contract_address());
        token_client.mint(&to, &amount);

        env.events().publish(
            (soroban_sdk::symbol_short!("mint"),),
            (to, amount),
        );
    }

    /// Burn INET tokens when bandwidth is consumed
    pub fn burn(env: Env, from: Address, amount: i128) {
        from.require_auth();

        let token_client = token::Client::new(&env, &env.current_contract_address());
        token_client.burn(&from, &amount);

        env.events().publish(
            (soroban_sdk::symbol_short!("burn"),),
            (from, amount),
        );
    }

    /// Transfer INET tokens
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();

        let token_client = token::Client::new(&env, &env.current_contract_address());
        token_client.transfer(&from, &to, &amount);

        env.events().publish(
            (soroban_sdk::symbol_short!("transfer"),),
            (from, to, amount),
        );
    }

    /// Get balance of an address
    pub fn balance(env: Env, address: Address) -> i128 {
        let token_client = token::Client::new(&env, &env.current_contract_address());
        token_client.balance(&address)
    }
}
