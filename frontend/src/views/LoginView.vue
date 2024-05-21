<template>
  
    <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h4 class="mb-0">Sign In</h4>
                  </div>
                  <div class="card-body">
                    <form @submit.prevent="login">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control rounded" id="email" aria-describedby="emailHelp" v-model="email" required>
                            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control rounded" id="password" v-model="password" required>
                        </div>
                      
                        <button type="submit" class="btn btn-primary rounded">Sign In</button>
                        <p v-if="error" style="color: red">{{ error }}</p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
</template>

<script>
export default {
  data() {
  return {
    email: "",
    password: "",
    
    error: null,
  };
},
  methods: {
    async login() {
      const success = await this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      });

      if (!success) {
        this.error = "Invalid email or password";
      } else {
        this.$router.push('/')
      }
    },
  },
};
</script>
