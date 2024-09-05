# TODO LIST TO IMPLEMENT

My system in Typescript will have the following structure:
- A Main module class which is treated as an entry point of modular system.
- A Application Factory static class which is responsible for constructing the application with all its dependencies, including the Main module, will always return computed Express application.

- A module class will always be marked by @Module decorator which is responsible for registering metadata of the module.
!! Need to precise, thoroughly, deeply understand about modular architecture in Typescript.
+ Metadata of a module class will be: imports, controllers, providers, exports.
++ imports: An array of imported modules.

## Note:
- Maybe consider separating core folder into imported packages, to ensure the separation of concerns and reusability.
- Using index.ts file to export all @public API of a package inside core folder, to ensure the encapsulation of the package.

- Transient dependency: Will be created each time it is requested.
- Singleton dependency: Will be created only once.
- Categorize modules into 2 types: Horizontal and vertical modules.
+ Horizontal modules: Are modules that provide a set of general services that can be used by other modules.
+ Vertical modules: Are modules that serves particular business domain, provide domain-specific functionality

## Modular architecture:

- Levelization:

Levelization is similar to layering, but is a finer-grained way to manage acyclic relationships between modules. With levelization, a single layer may contain multiple module levels. To levelize modules, do the following: 
+ Assign external modules level 0. 
+ Modules dependent only on level 0 modules are assigned level 1. 
+ Modules dependent on level 1 are assigned level 2. 
+ Modules dependent on level n are assigned level n + 1.

- Physical layer:

Layering a system helps ease maintenance and testability of the application. Common layers include presentation (i.e., user interface), domain (i.e., business), and data access. Any conceptually layered software system can be broken down into modules that correspond to these conceptual layers. Physical layers helps increase reusability because each layer is a deployable unit.

- Module Façade:

Fine-grained and lightweight modules are inherently more reusable. But fine-grained modules are also typically dependent on several other modules. A Module Façade defines a higher level API that coordinates the work of a set of fine-grained modules. The façade emphasizes ease of use while the finer-grained modules emphasize reuse.
+ Don't emphasize reuse of the façade. Use it to wire together and configure multiple fine-grained modules.
+ Place context and environmental dependencies in the façade.
+ Use the façade as an entry point for your integration tests.

- Test Module:

Test modules contain all of the tests for the classes in a specific module. They allow you to test a module's underlying implementation. A Test Module may contain unit tests that test a module's classes, as well as integration tests that test the entire module's functionality.
+ Depending on Abstract Modules make it easier to define mocks and stubs for testing a module independently.
+ For larger tests suites, or situations where performance is paramount, separate different types of tests (i.e., unit tests, integration tests, performance tests, etc.) out into separate test modules.
+ Ideally, you'll only include the test module and the module under test in the classpath when executing the tests. Pragmatically, some modules may require other dependent modules.
