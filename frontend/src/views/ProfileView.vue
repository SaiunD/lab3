<template>
  <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <div class="text-center">
                        <h1 class="mt-5 font-color"></h1>
                        
                        <img src="@/assets/icons/avatar.svg" alt="Avatar" class="img-fluid rounded-circle mt-5 mb-3" style="width: 150px; height: 150px;" id="avatarImage">
                        <br>
                        <button type="button" @click="goToEditProfile" class="btn btn-primary rounded" id="editProfileButton" >Edit Profile</button>

                    </div>
                </div>
                <div class="col-md-8">
                    <h1 class="mt-5 font-color">My Profile</h1>
                    <table id="my-table" class="table">
                      <tbody>
                          <tr>
                              <th scope="row">Name</th>
                              <td id="nameField">{{user.name_}}</td>
                          </tr>
                          <tr>
                              <th scope="row">Surname</th>
                              <td id="surnameField">{{user.surname}}</td>
                          </tr>
                          <tr>
                              <th scope="row">Email</th>
                              <td id="emailField">{{user.email}}</td>
                          </tr>
                          <tr>
                              <th scope="row">Date of birth</th>
                              <td id="ageField">{{user.birth}}</td>
                          </tr>
                          <tr>
                              <th scope="row">Country</th>
                              <td id="countryField">{{user.country}}</td>
                          </tr>
                      </tbody>
                    </table>
                </div>
            </div>
        </div>
        <br> <br> <br>
</template>

<script>
export default {
  
  data(){
    return {
      showModal: false // Змінна, яка вказує, чи показувати модальне вікно
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods:{
    goToEditProfile() {
        this.$router.push({ name: 'edit_profile' });
      }
  },
  beforeRouteEnter(to, from, next) {
    if (!localStorage.getItem("token")) {
      next({ path: "/login" });
    } else {
      next();
    }
  },
};
</script>
