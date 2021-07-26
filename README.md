# AsyncApi Simulator
___

 In development
 
---

Ever wondered what it would feel like your application to 
be the center of interest?

Does it seem distant or difficult to switch from development mode
to production mode?

#### Define and simulate high traffic scenarios for your app and create statistics.

### Supported Protocols

- mqtt

Usage

```
simulator -f ./my_api.yaml -s ./scenario.yaml
simulator -f ../subdirectory/my_api.json -s ./scenario.json
```

Run sample application with --gameProcessor or by specifying the corresponding 
asyncApi and scenario files.
```
simulator --gameProcessor
simulator -f game-processor/asyncapi.yaml -s game-processor/scenario.yaml

```

### Scenario File 

Here with an id you name 
- Connect your asyncApi and scenario File. 
- Specify the parameters for each channel and have the options for them to be randomly generated.
- Specify the payload you want to send.

### AsyncApi File

 The file where the api you want to test is defined. By specifying the x-plot field
under a channel will automatically make the channel available for sending requests.


Cli

```
Options:
  -v                      async-api performance tester cli version
  -f, --filepath <type>  The filepath of a async-api specification yaml or json file
  -s, --scenario <type>  The filepath of a scenario file.
  
  -h, --help             display help for command

```



