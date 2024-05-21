<template>
    <div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h4 class="mb-0">Add Publication</h4>
                </div>
                <div class="card-body">
                    <form @submit.prevent="addPublication">
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
                            <button id="add-pub" type="submit" class="btn btn-primary btn-block rounded">Add</button>
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
    name: 'AddPublication',
    data() {
      return {
        author: '',
        publication: '',
        collection: '',
        field: ''
      }
    },
    methods: {
      addPublication() {
        const publicationData = {
        author: this.author,
        publication: this.publication,
        collection: this.collection,
        field: this.field
      };
      
      // Виконуємо POST запит на сервер для додавання публікації
      axios.post('http://localhost:3000/publications/add', publicationData)
        .then(response => {
          // Обробка успішної відповіді від сервера
          console.log('Publication added successfully:', response.data);
          
          // Очистка форми після додавання
          this.author = '';
          this.publication = '';
          this.collection = '';
          this.field = '';
          
           this.$router.push({ name: 'publications' });

        })
        .catch(error => {
          // Обробка помилки при відправленні запиту на сервер
          console.error('Error adding publication:', error);
        });
    }
  }
  }
  </script>
  