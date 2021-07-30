# AsyncApi Simulator
___

 In development
 
---

Ever wondered what it would feel like your application to 
be the center of interest?

Does it seem distant or difficult to switch from development mode
to production mode?

#### Define and simulate scenarios for your applications and create statistics.



Usage

```
simulator -f ./my_api.yaml -s ./scenario.yaml
simulator -f ../subdirectory/my_api.json -s ./scenario.json
```

Run sample application with --gameProcessor or by specifying the corresponding 
asyncApi and scenario files.
```
simulator -f ./example-projects/game-processor/asyncapi.yaml -s ./example-projects/game-processor/scenario.yaml
or
simulator -b ../ -f ./simulatorFolder/example-projects/game-processor/asyncapi.yaml -s ./simulatorFolder/example-projects/game-processor/scenario.yaml
```



### Cli

```
Options:
  -v                     async-api performance tester cli version
  -f, --filepath <type>  The filepath of a async-api specification yaml or json asyncApiF
  -s, --scenario <type>  The filepath of a AsyncApi File defining a scenario based on the spec.
  -b, --basedir <type>   The basePath from which relative paths are computed.
                         Defaults to the root directory of the project.
  -h, --help             display help for command


```

### Supported Protocols

- mqtt

### AsyncApi File

The file where the api you want to test is defined. By specifying the x-plot: {id} field
under a channel will automatically make the channel available for sending requests.



### Scenario File

Here with the plot-{id} (where id is the same as the x-plot: {id} in the field you specified in the AsyncAPI channel) field you:
- Connect your asyncApi and scenario File.
- Specify the parameters for each channel and have the options for them to be randomly generated.
- Specify the payload you want to send.


