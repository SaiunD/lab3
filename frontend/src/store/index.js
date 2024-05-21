import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
    state() {
        return {
            auth: {
                isAuthenticated: false,
                token: null,
            },
            user: {
                id: null,
                email: null,
                name_: null,
                surname: null,
                gender: null,
                birth: null,
                country: null,
            },
        };
    },
    getters: {
        authenticated(state) {
            return state.auth.isAuthenticated;
        }
    },
    mutations: {
        setAuth(state, { isAuthenticated, token }) {
            state.auth.isAuthenticated = isAuthenticated;
            state.auth.token = token;

            if (!isAuthenticated) {
                state.user.id = null;
                state.user.email = null;
                state.user.name_ = null;
                state.user.surname = null;
                state.user.gender = null;
                state.user.birth = null;
                state.user.country = null;
            }
        },
        setUser(state, { id, email, name_, surname, gender, birth, country}) {
            state.user.id = id;
            state.user.email = email;
            state.user.name_ = name_;
            state.user.surname = surname;
            state.user.gender = gender;
            state.user.birth = birth;
            state.user.country = country;
        },
    },
    actions: {
        async register({ commit }, { email, password, name_, surname, gender, birth, country }) {
            try {
                await axios.post("http://localhost:3000/register", {
                    email,
                    password,
                    name_,
                    surname,
                    gender,
                    birth,
                    country,
                });
                return true;
            } catch (err) {
                return false;
            }
        },
        async login({ commit }, { email, password }) {
            try {
                const res = await axios.post("http://localhost:3000/login", {
                    email,
                    password,
                });

                const token = res.data.token;
                const decoded = JSON.parse(atob(token.split(".")[1]));

                commit("setAuth", { isAuthenticated: true, token });
                commit("setUser", { id: decoded.id, email, name_: res.data.name_, surname: res.data.surname, gender: res.data.gender, birth: res.data.birth, country: res.data.country });

                localStorage.setItem("token", token);

                return true;
            } catch (err) {
                return false;
            }
        },
        async logout({ commit }) {

            commit("setAuth", { isAuthenticated: false, token: null });
            localStorage.removeItem("token");
        },
        async fetchProfile({ commit }) {
            try {
                const res = await axios.get("http://localhost:3000/profile", {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                });

                commit("setUser", { id: res.data.id, email: res.data.email });

                return true;
            } catch (err) {
                commit("setAuth", { isAuthenticated: false, token: null });
                localStorage.removeItem("token");

                return false;
            }
        },
        async saveProfile({ commit, state }) {
            try {
                const res = await axios.put("http://localhost:3000/profile", state.user, {
                    headers: {
                        "x-access-token": state.auth.token,
                    },
                });

                commit("setUser", res.data);

                return true;
            } catch (err) {
                return false;
            }
        },
    },
});

export default store;