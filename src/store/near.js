import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";

const near = {
    namespaced: true,
    state: () => ({
        loading: false,
        network: "testnet",
        wallet: null,
        modal: null,
        user: null,
        provider: null,
        id: null,
    }),
    mutations: {
        setProvider(state, payload){
            state.provider = payload
        },
        setUser(state, payload){
            state.user = payload
        },
        setWallet(state, payload){
            state.wallet = payload
        },
        setModal(state, payload){
            state.modal = payload
        },
        setLoading(state, payload){
            state.loading = payload
        }
    },
    actions: {
        async Init({state, commit, dispatch}){
            const wallet = await setupWalletSelector({
                network: state.network,
                modules: [
                  ...(await setupDefaultWallets()),
                  setupNearWallet(),
                  setupWalletConnect({
                    projectId: "Dataverse",
                    metadata: {
                      name: "NEAR Wallet Selector",
                      description: "Example dApp used by NEAR Wallet Selector",
                      url: "https://github.com/near/wallet-selector",
                      icons: ["https://avatars.githubusercontent.com/u/37784886"],
                    },
                  }),
                ],
            });
            const modal = setupModal(wallet, {
                contractId: "guest-book.testnet"
            });
            const provider = wallet.store.getState();
            wallet.on("signedIn", () => {
                dispatch('Login')
            })
            wallet.on("accountsChanged", (walletId, accounts) => {
                dispatch('Login')

            })
            commit('setProvider', provider)
            commit('setModal', modal)
            commit('setWallet', wallet)
        },
        async Logout({state, commit}){
            commit('setLoading', true)
            const session = (await state.wallet.wallet(state.provider.selectedWalletId))
            session.signOut();
            commit('setUser', state.provider.accounts.find((account) => account.active)?.accountId || null);
            commit('setLoading', false)
        },
        // a soft signout I guess. Just disconnect it from the UI
        async Disconnect({state, commit}){
            commit('setLoading', true)
            //const session = (await state.wallet.wallet(state.provider.selectedWalletId))
            //session.signOut();
            commit('setUser', state.provider.accounts.find((account) => account.active)?.accountId || null);
            commit('setLoading', false)
        },
        async Connect({ state, commit }) {
            commit('setLoading', true)
            state.modal.show();
            commit('setUser', state.provider.accounts.find((account) => account.active)?.accountId || null);
            commit('setLoading', false)
        },
        async Disconnect({ state, commit }) {
            commit('setLoading', true)
            window.location.reload();
            commit('setLoading', false)
        },
        stopLoading({commit}){
            commit('setLoading', false)
        }
    },
    getters: {
        isLoading(state){
            return state.loading
        },
        isConnected(state){
            return state.user ? true : false
        },
        ready(state){
            return state.user ? true : false
        }
    }
}
export default near