<template>
  <main>
    <div class="container mt-5">
      <h2 class="mb-4 font-color">Publications</h2>
      <hr />
      <div class="row mb-3">
        <!-- Search input -->
        <div class="col-md-4">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Search"
              v-model="searchQuery"
              @input="searchPublications"
            />
            <button class="btn btn-primary rounded" type="button" @click="searchPublications">
              <img src="@/assets/icons/search_icon1.svg" alt="Search Icon" width="20" height="20" />
            </button>
          </div>
        </div>
        <!-- Sort select -->
        <div class="col-md-3">
          <select v-model="sortField" class="form-select" @change="sortPublications">
            <option selected disabled>Sort by field</option>
            <option value="author">Author</option>
            <option value="publication">Publication</option>
            <option value="collection">Collection</option>
            <option value="field">Field</option>
          </select>
        </div>
        <!-- Buttons for user's publications and adding new publication -->
        <div class="col-md-5">
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button 
              class="btn me-md-2 mb-2 mb-md-0 rounded" 
              :class="{ 'btn-primary': !showingMyPublications, 'btn-secondary': showingMyPublications }"
              @click="toggleMyPublications">
              My Publications
            </button>
            <button class="btn btn-success align-items-center" @click="addPublication">
              <img src="@/assets/icons/add.svg" alt="Add" width="16" height="16" class="me-1" />Add
            </button>
          </div>
        </div>
      </div>
      <!-- Publications table -->
      <div id="pub-tab" class="table-responsive-sm">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Author</th>
              <th>Publication</th>
              <th>Collection</th>
              <th>Field</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="publication in paginatedPublications" :key="publication.id">
              <td>{{ publication.author }}</td>
              <td>{{ publication.publication }}</td>
              <td>{{ publication.collection }}</td>
              <td>{{ publication.field }}</td>
              <td>
                <button class="btn btn-primary btn-sm rounded" @click="editPublication(publication.id)"><img src="@/assets/icons/edit.svg" width="16" height="16"></button>
                <button class="btn btn-danger btn-sm" @click="deletePublication(publication.id)"><img src="@/assets/icons/delete.svg" width="16" height="16" ></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Publications',
  data() {
    return {
      searchQuery: '',
      sortField: '',
      publications: [],
      currentPage: 1,
      itemsPerPage: 10,
      showingMyPublications: false,
    };
  },
  computed: {
    filteredPublications() {
      let publications = this.publications;
      if (this.searchQuery) {
        publications = publications.filter((publication) =>
          Object.values(publication).some((value) => {
            if (typeof value === 'string') {
              return value.toLowerCase().includes(this.searchQuery.toLowerCase());
            }
            return false;
          })
        );
      }
      if (this.sortField) {
        publications = publications.sort((a, b) =>
          a[this.sortField].localeCompare(b[this.sortField])
        );
      }
      return publications;
    },
    paginatedPublications() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPublications.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredPublications.length / this.itemsPerPage);
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    fetchPublications() {
      axios.get('http://localhost:3000/publications')
        .then(response => {
          this.publications = response.data;
        })
        .catch(error => {
          console.error('An error occurred while fetching publications:', error);
        });
    },
    searchPublications() {
      this.currentPage = 1;
    },
    toggleMyPublications() {
      this.showingMyPublications = !this.showingMyPublications;
      if (this.showingMyPublications) {
        this.showMyPublications();
      } else {
        this.fetchPublications();
      }
    },
    showMyPublications() {
      axios.get('http://localhost:3000/publications/filter', {
        params: {
          author: `${this.user.name_} ${this.user.surname}`
        }
      })
      .then(response => {
        this.publications = response.data;
        this.sortPublicationsByName();
      })
      .catch(error => {
        console.error('An error occurred while fetching user publications:', error);
      });
    },
    sortPublicationsByName() {
      this.publications.sort((a, b) => a.author.localeCompare(b.author));
    },
    addPublication() {
      this.$router.push({ name: 'add' });
    },
    editPublication(id) {
      this.$router.push({ name: 'edit', params: { id } });
    },
    deletePublication(id) {
      axios.delete(`http://localhost:3000/publications/${id}`)
        .then(response => {
          this.fetchPublications();
        })
        .catch(error => {
          console.error('An error occurred while deleting the publication:', error);
        });
    },
    sortPublications() {
      this.currentPage = 1;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.fetchPublications();
  },
};

</script>