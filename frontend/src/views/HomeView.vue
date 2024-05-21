<template>
  <body>
        <main>
          <div class="container">
            <h1 class="mt-5" text>Welcome to ScholarHub!</h1>
            <hr> <!-- Лінія, щоб розділити заголовок від наступного контенту -->
        
            <p>
                <b><i>ScholarHub</i></b> - це онлайн платформа з базою даних наукових публікацій, яка призначена для дослідників,
                студентів, викладачів та всіх зацікавлених у наукових дослідженнях. Наша мета - забезпечити доступ до
                широкого спектру наукових публікацій у різних галузях знань.
            </p>
            <hr> <!-- Лінія, щоб розділити текст від наступного заголовку -->
        
            <h2>Main Features:</h2>
            <div class="row">
              <div class="col-md-6">
                  <div class="card mb-3">
                      <div class="card-body">
                          <strong>Пошук:</strong> Наша база даних включає тисячі наукових статей, журналів, конференційних матеріалів та інших джерел. Користувачі можуть шукати публікації за ключовими словами, авторами, темами та іншими параметрами.
                      </div>
                  </div>
              </div>
              <div class="col-md-6">
                  <div class="card mb-3">
                      <div class="card-body">
                          <strong>Фільтрація:</strong> Для зручності користувачів доступні фільтри, які дозволяють точно налаштувати пошуковий запит і отримати релевантні результати.
                      </div>
                  </div>
              </div>
              <div class="col-md-6">
                  <div class="card mb-3">
                      <div class="card-body">
                          <strong>Зручний доступ:</strong> Наш сайт доступний для використання на будь-яких пристроях, включаючи комп'ютери, планшети та смартфони. Користувачі можуть зручно переглядати публікації навіть у рухі.
                      </div>
                  </div>
              </div>
              <div class="col-md-6">
                  <div class="card mb-3">
                      <div class="card-body">
                          <strong>Додавання публікацій:</strong> Користувачі можуть додавати свої публікації легко та швидко для ще швидшого обміну досвідом та знаннями.
                      </div>
                  </div>
              </div>
          </div>
          <hr>
          <p>
            <b><i>ScholarHub</i></b> - це місце зустрічі для наукової спільноти, де кожен може знайти цікаві та актуальні
              дослідження для власного професійного зростання та розвитку знань.
          </p>
        </div>
        <br> <br> <br> <br>
        </main>

        <footer class="footer fixed-bottom py-3 bg-light d-flex justify-content-center align-items-center">
            <div>
                <span class="text-muted">© 2024 ScholarHub</span>
            </div>
        </footer>
      </body>
</template>



<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$store.state.auth.isAuthenticated;
    },
    user() {
      return this.$store.state.user;
    },
  },
};
</script>
