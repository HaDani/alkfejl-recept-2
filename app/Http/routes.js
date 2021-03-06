'use strict'

const Route = use('Route')

// Route.on('/').render('welcome')
// Route.on('/').render('main')
// Route.get('/', function * (request, response) {
//     yield response.sendView('main');
// });
Route.get('/', 'RecipeController.index')
Route.get('/recipes/create', 'RecipeController.create')
Route.post('/recipes/create', 'RecipeController.doCreate')
Route.get('/recipes/:id', 'RecipeController.show')
Route.get('/recipes/:id/edit', 'RecipeController.modify')
Route.post('/recipes/:id/edit', 'RecipeController.doModify')
Route.get('/recipes/:id/delete', 'RecipeController.delete')
Route.get('/register', 'UserController.register')
Route.post('/register', 'UserController.doRegister')
Route.get('/login', 'UserController.login')
Route.post('/login', 'UserController.doLogin')
Route.get('/logout', 'UserController.doLogout')
