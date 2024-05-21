<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg custom-navbar-color">
      <div class="container-fluid">
        <router-link class="navbar-brand custom-font-logo" to="/">
          <img src="@/assets/icons/icon.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-centre">
          SсholarHub
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li v-if="authenticated" class="nav-item">
              <router-link class="nav-link custom-font-all" to="/publications">Publications</router-link>
            </li>
          </ul>
          <!-- Профіль -->
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle custom-font-all" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Profile
              </a>
              <ul class="dropdown-menu dropdown-menu-end custom-dropdown">
                <li v-if="!authenticated">
                  <router-link class="dropdown-item" to="/login">
                    <img src="@/assets/icons/sign-in-icon.svg" alt="Sign In Image" width="20" height="20">
                    Sign In
                  </router-link>
                </li>
                <li v-if="!authenticated">
                  <router-link class="dropdown-item" to="/register">
                    <img src="@/assets/icons/sign-up-icon.svg" alt="Sign Up Image" width="20" height="20">
                    Sign Up
                  </router-link>
                </li>
                <li v-if="authenticated">
                  <router-link class="dropdown-item" to="/profile">
                    <img src="@/assets/icons/user-icon-1.svg" alt="User Image" width="15" height="15">
                    My Profile
                  </router-link>
                </li>
                <li v-if="authenticated">
                  <hr class="dropdown-divider">
                </li>
                <li v-if="authenticated">
                  <a class="dropdown-item" href="#" @click="logout">
                    <img src="@/assets/icons/logout-icon.svg" alt="Logout Image" width="20" height="20">
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    authenticated() {
      return this.$store.getters.authenticated;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push('/login');
    },
  },
};
</script>

<style>
.custom-navbar-color {
  background-color: #f5f5f5;
}
.custom-font-logo {
  font-family: Arial, sans-serif;
}
.custom-font-all {
  font-family: Arial, sans-serif;
}
.custom-dropdown {
  background-color: #fff;
}
</style>
