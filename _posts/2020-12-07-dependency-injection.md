---
layout: post
title: "A straightforward introduction to Dependency Injection"
date: 2020-12-07 01:00:00 +0200
categories: inversion patterns
author: Jorge Cifuentes
excerpt: This post presents a concise and short introduction to the technique called Dependency Injection (DI).
---

This post presents a concise and short introduction to the technique called Dependency Injection (DI).

<br/>

## The task
Let's say you have a database with user-related data and that you want to query some of this data to process it. You might start with a class looking like this, using a `SqlReader` class:

```cs
public class Foo {

    SqlReader dataReader;

    constructor() {
        this.dataReader = new SqlReader();
    }

    public double Process(int userId) {
        var data = this.reader.QueryById(userId);
        // process the data
        // ...
    }        
}
```

<br/><br/>

## The problem
Imagine that your software expands and, when running in a new  mode, it should not get the data from a database but from some CSV files.

The main obstacle here is that our `Foo` class is coupled with the `SqlReader`: you can see it in the fact that a **new** instance is created in the constructor. In short words, it depends on an implementation: `SqlReader` is a **dependency** of `Foo`.

One could add this CSV functionality to the `SqlReader` class (ugly) or make `CsvReader` expand `SqlReader` (would get messy when adding even new more readers). This is a perfect use case for **inversion of control**.


<br/><br/>


## The inversion of control

### Theory
Here is where the concept **Dependency Inversion** gets to shine. Simply speaking, it means that the control of any class dependencies should be inverted: the `Foo` class shouldn't be the one instantiating a `SqlReader`. 

This can be accomplished with the technique called **Dependency Injection**: it applies the principle that ensures classes are never responsible of supplying their own dependencies (they get _injected_).

And why is it important? It helps you decouple your application: you have the implemented code in one side, and the code that uses it in the other, both depending on a **common interface**. You can change them separately as long as it fits the interface, thanks to the concerns being separated.

<p align="center">
  <img src="/assets/images/di.png" />
</p>

### The code
Usually, you would start by creating an interface `IReader`:

```cs
public class IReader {
    public List<Data> QueryById(int id);
}
```

and implement it for every reader you wanted:

```cs
public class SqlReader : IReader {
    public List<Data> QueryById(int id) {
        // ...
    }
}
```
```cs
public class CsvReader : IReader {
    public List<Data> QueryById(int id) {
        // ...
    }
}
```

<br/><br/>

### Interfaces? Nothing new

You probably already knew about interfaces and, at the end of the day, an object based on one has to be instantiated with a concrete implementation. So how is it better if you're going to end up doing this?:

```cs
public class Foo {

    IReader dataReader;

    constructor() {
        this.reader = new SqlReader(); // <--- coupling
    }

    public double Process(int userId) {
        var data = this.reader.QueryById(userId);
        // process the data
        // ...
    }       
}
```

<br/>
This is where the **dependency inversion container** plays its part: somewhere in your code, you still need to instantiate the implementation of the interface. The container is the one actually instantiating your objects and supplying them, so your code will look like this:

```cs
public class Foo {

    IReader dataReader;

    constructor(IReader r) { // <--- this is called by the container
        this.reader = r; // <--- injection
    }

    public double Process(int userId) {
        var data = this.reader.QueryById(userId);
        // process the data
        // ...
    }       
}
```
<br/>
The container is a fairly complicated software that tracks and manages how interfaces are implemented. You could simplify them in your mind as a dictionary of interfaces mapped to implementing classes. Some examples of these containers are Autofac or Ninject.

With Autofac you can do something in the lines of this to have multiple implementations depending on some runtime variable:

```cs
if (someCondition)
    builder.RegisterType<SqlReader>().As<IReader>();
else
    builder.RegisterType<CsvReader >().AsIReader>();
```

<br/>
The magic thing about containers, as opposed to wiring the dependencies yourself, is that you don't have to worry about calling the constructor with `new SqlReader()`. This is very useful with a lot of interfaces where the dependency chain is deeply nested. **You just tell the container what implementation you want to use** and let it inject it using the constructor in whatever number of classes you might have.

After these changes, total decoupling is achieved. `Foo` doesn't have to know any details of `IReader` or even how its instantiated: **it just gets injected**.

Note that containers usually can inject dependencies via the constructor, or a property or field.


<br/><br/>

### So what is it useful for?

#### Extensibility and reusability

The first thing to note is that given your code is based on abstracts, extending it's as easy as implementing new classes and telling the container under which circumstances they should be used. The same code using `IReader` can work with a `SqlReader`, `CsvReader`, `JsonReader` or any other implementation. You can change and switch these classes without having to change the code that uses them.

#### Unit testing

If you wanted to test the `Foo.Process` method, hitting your database when running tests would be, most of the time, an anti-pattern and slow.

But, since Foo depends on the interface `IReader`, you can resolve this interface to `SqlReader` in normal execution and `FakeDataReader` while running tests. The `FakeDataReader` would just fake the database using in-memory variables. That would mean faster tests and in a more controlled and reproducible environment.

#### Safer parallel programming

Two developers can work with classes that use each other only based on the interface, without having to modify the other developer files. Less git conflicts 😃.


<br/><br/>


### The cons

Obviously, the main adverse effect is the added layer of **indirection**. This makes the software a bit harder to understand - your implemented classes won't be directly referenced where they will be used. You won't be able to find references or easily trace them, and you won't know which implementation is injected until you debug it.


<br/><br/>

### Wrap-up
To summarize, dependency injection is a technique used to satisfy the **dependency inversion principle**, introducing interfaces between a high-level class and its dependencies and making their relation loosely coupled assuring that the only central point where an interface is related to its actual implementation is in the container code.

The three steps to achieve this would be:

1. Get your high-level class dependencies injected via the constructor (_dependency injection_).
2. Make this dependencies implement a common interface (_decoupling_).
3. Leave the hassle of calling all the injecting constructors to a dependency inversion container.

As a sidenote, using interfaces isn't inherent to dependency injection: you can have dependencies marked as a normal class and have them injected, but DI works better with interfaces.


At the end of the day, using this technique is a development decision up the creator. Any questions?
