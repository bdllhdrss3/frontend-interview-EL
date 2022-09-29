# JavaScript: ToDo List

## Environment 

- Node Version: 16
- Default Port: 8000

## Goal

Extend functionality of existing ToDo List application with ability to categorize tasks.

### Description

As a user I would like to categorize tasks when creating them. Since every user have their own preferences, categories should be dynamically created.

### Acceptance criteria

1. Next to What needs to be done? field should be text input field Category  
2. Store categories in localStorage under the todos-vanillajs_categories key  
3. Task should only be created when both Task and Category field are filled and either of them are in focus.   
4. In the list of existing tasks categories should be shown as labels.  
5. Every task can belong to one category only.  
6. Category should have a dropdown to select existing category. If no existing categories match a new category should be created.   
7. When task is being created and input text in Category field matches already existing category it should be reused.  
8. Deleting the last task within category should delete category also.  

### Evaluation criteria

1. Code should be maintainable and testable.  
2. Application architecture should not be affected in a bad way.  
3. Follow best practices when writing code. Example variables naming, comments, formatting etc.  
4. Task is a work in progress, valuable feedback will earn you additional points.  


## Project Specifications

**Read Only Files**
- `test/*`
- `server.js`

**Commands**
- run: 
```bash
bash bin/env_setup && . $HOME/.nvm/nvm.sh && npm start
```
- install: 
```bash
bash bin/env_setup && . $HOME/.nvm/nvm.sh && npm install
```
- test: 
```bash
bash bin/env_setup && . $HOME/.nvm/nvm.sh && npm test
```
