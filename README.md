![plot](./github-repobanner-simulator.png)
<p align="center">
  <em>The official application for simulating scenarios</em>
</p>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

- Command line library and desktop application for generating asynchronous traffic.

- Visualize your asyncApi files and test your asynchronous networks.

![Image Alt Text](https://github.com/asyncapi/simulator/blob/master/simulator_screenshot.JPG?raw=true)


---

## :loudspeaker: ATTENTION:

This package is under development and it has not reached version 1.0.0 yet, which means its API might get breaking changes without prior notice. Once it reaches its first stable version, we'll follow semantic versioning.

---

#### Define and simulate scenarios for your applications


Usage

#### Throught desktop application (underDevelopment):     
```
npm run desktop
```
[Dowload mqtt.zip](https://github.com/asyncapi/simulator/files/13696873/mqtt.zip)

https://github.com/SumantxD/simulator/assets/65810424/a8f143b8-1ba5-4b8e-bb2a-5e2f4a91c1e1



#### Throught command line:


```
simulator -f ./my_api.yaml -s ./scenario.yaml
simulator -f ../subdirectory/my_api.json -s ./scenario.json
```

Run sample application by specifying the corresponding 
AsyncApi and scenario files.
```
simulator -f ./example-projects/game-processor/asyncapi.yaml -s ./example-projects/game-processor/scenario.yaml
or
simulator -b ../ -f ./simulatorFolder/example-projects/game-processor/asyncapi.yaml -s ./simulatorFolder/example-projects/game-processor/scenario.yaml
```



### Cli

```
Options:
  -v                     AsyncApi simulator cli version.
  -f, --filepath <type>  The filepath of a AsyncAPI document, as either yaml or json file.
  -s, --scenario <type>  The filepath of a json or yaml file which defines a scenario based on the spec.
  -b, --basedir <type>   The basePath from which relative paths are computed.
                         Defaults to the directory where simulator.sh resides. (default: "./").
  -h, --help             Display help for flags and commands.

```

### Supported Protocols

- mqtt

### AsyncApi File

The file where the api you want to test is defined. By specifying the x-plot: {id} field
under a channel will automatically make the channel available for sending requests.



### Scenario File

Here with the plot-{id} (where id is the same as the x-plot: {id} in the field you specified in the AsyncAPI channel) field you:
- Connect your AsyncApi and scenario File.
- Specify the parameters for each channel and have the options for them to be randomly generated.
- Specify the payload you want to send.

## Contributing

Read [CONTRIBUTING](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) guide.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/NektariosFifes"><img src="https://avatars.githubusercontent.com/u/61620751?v=4?s=100" width="100px;" alt=""/><br /><sub><b>NektariosFifes</b></sub></a><br /><a href="https://github.com/asyncapi/fluffy-robot/commits?author=NektariosFifes" title="Code">💻</a> <a href="https://github.com/asyncapi/fluffy-robot/commits?author=NektariosFifes" title="Documentation">📖</a> <a href="#ideas-NektariosFifes" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-NektariosFifes" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/fluffy-robot/commits?author=NektariosFifes" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/jonaslagoni"><img src="https://avatars.githubusercontent.com/u/13396189?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="https://github.com/asyncapi/fluffy-robot/commits?author=jonaslagoni" title="Documentation">📖</a> <a href="https://github.com/asyncapi/fluffy-robot/pulls?q=is%3Apr+reviewed-by%3Ajonaslagoni" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-jonaslagoni" title="Mentoring">🧑‍🏫</a> <a href="#example-jonaslagoni" title="Examples">💡</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
