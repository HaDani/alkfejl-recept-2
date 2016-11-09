'use strict'

const Database = use('Database')
const Category = use('App/Model/Category')
const Recipe = use('App/Model/Recipe')
const Validator = use('Validator')

class RecipeController {
  * index(request, response) {
    // const categories = yield Database.from('categories').select('*')
    // response.send(categories)
    const categories = yield Category.all()

    for (let category of categories) {
      const topRecipes = yield category.recipes().limit(3).fetch()
      category.topRecipes = topRecipes.toJSON()
    }

    yield response.sendView('main', {
      categories: categories.toJSON()
    })
  }

  * create(request, response) {
    const categories = yield Category.all();

    yield response.sendView('createRecipe', {
      categories: categories.toJSON()
    });
  }

  * doCreate(request, response) {
    const recipeData = request.except('_csrf');
    //response.send(recipeData);
    const rules = {
      name: 'required',
      ingredients: 'required',
      instructions: 'required',
      category_id: 'required'
    }
    const validation = yield Validator.validateAll(recipeData, rules);
    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      response.redirect('back')
      return
    }

    yield Recipe.create(recipeData);

    response.redirect('/');
  }

  * show(request, response) {
    const id = request.param('id');
    const recipe = yield Recipe.find(id);


    if (!recipe) {
      response.notFound('Recipe not found.')
      return
    }

    yield recipe.related('category').load()


    yield response.sendView('showRecipe', {
      recipe: recipe.toJSON()
    })
  }

  * modify(request, response) {

    const categories = yield Category.all();

    const id = request.param('id');
    const recipe = yield Recipe.find(id);

    if (!recipe) {
      response.notFound('Recipe not found.')
      return
    }

    yield recipe.related('category').load();

    console.log(recipe.toJSON())
    yield response.sendView('modifyRecipe', {
      recipe: recipe.toJSON(),
      categories: categories.toJSON()
    });
  }

  * doModify(request, response) {
    const recipeData = request.except('_csrf');

    console.log(recipeData);
    const rules = {
      name: 'required',
      ingredients: 'required',
      instructions: 'required',
      category_id: 'required'
    }
    const validation = yield Validator.validateAll(recipeData, rules);
    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      response.redirect('back')
      return
    }

    const id = request.param('id');
    const recipe = yield Recipe.find(id);
    recipe.name = recipeData.name;
    recipe.ingredients = recipeData.ingredients;
    recipe.instructions = recipeData.instructions;
    recipe.category_id =  recipeData.category_id;
    
    yield recipe.save();

    response.redirect('/');
  }

  * delete (request, response) {
      const recipeData = request.except('_csrf');

      recipe.delete();
  }
}

module.exports = RecipeController
