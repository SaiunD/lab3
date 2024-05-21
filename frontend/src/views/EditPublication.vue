<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">Edit Publication</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="editPublication">
                <div class="mb-3">
                  <label for="author" class="form-label">Author</label>
                  <input type="text" class="form-control rounded" id="author" v-model="author" required>
                </div>
                <div class="mb-3">
                  <label for="publication" class="form-label">Publication</label>
                  <input type="text" class="form-control rounded" id="publication" v-model="publication" required>
                </div>
                <div class="mb-3">
                  <label for="collection" class="form-label">Collection</label>
                  <input type="text" class="form-control rounded" id="collection" v-model="collection" required>
                </div>
                <div class="mb-3">
                  <label for="field" class="form-label">Field</label>
                  <select class="form-select rounded" id="field" v-model="field" required>
                    <option disabled selected>Select a field</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Sociology">Sociology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Environmental Science">Environmental Science</option>
                  </select>
                </div>
                <div class="text-center">
                  <button id="edit-pub" type="submit" class="btn btn-primary btn-block rounded">Edit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  name: 'EditPublication',
  props: ['id'], // Prop для передачі id публікації для редагування
  data() {
    return {
        id: 0,
      author: '',
      publication: '',
      collection: '',
      field: ''
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    fetchPublication() {
        this.id = this.$route.params.id;

    axios.get(`http://localhost:3000/publications/${this.id}`)
      .then(response => {
        const publicationData = response.data;
        this.author = publicationData.author;
        this.publication = publicationData.publication;
        this.collection = publicationData.collection;
        this.field = publicationData.field;
      })
      .catch(error => {
        console.error('Error fetching publication for editing:', error);
      });
  },
    editPublication() {
      const publicationData = {
        author: this.author,
        publication: this.publication,
        collection: this.collection,
        field: this.field
      };
      
      // Виконати PUT запит на сервер для редагування публікації
      axios.put(`http://localhost:3000/publications/edit/${this.id}`, publicationData)
        .then(response => {
          // Обробка успішної відповіді від сервера
          console.log('Publication edited successfully:', response.data);
          
          // Перенаправлення користувача на сторінку публікацій після успішного редагування
          this.$router.push({ name: 'publications' });
        })
        .catch(error => {
          // Обробка помилки при відправленні запиту на сервер
          console.error('Error editing publication:', error);
        });
    }
  },
  mounted() {
    // При монтажі компонента отримати дані публікації для редагування
    this.fetchPublication();
  }
}
</script>
