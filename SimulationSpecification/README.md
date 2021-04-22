# Plots Schema

This Specification Aims to define a json Schema for validating the format 
of json files whose purpose is to be used as Configuration files for the 
Application Simulator. Simulation Plot files as we call them can describe 
the stages of a simulation , the total load of each endpoint in total requests
or percentage , and the file to export results of the simulation.

##Properties

Plot-ver: The version of the schema
- String| 0.0.1 
---
Info
- String| Information about the purpose of this plot.

---
Plots

+ Object
   - Object| Plot | {Plot name of your choise}
      + integer| NoOfRequests
      + integer| PercentageOfLoad
      + Array | Channels
        * String| Uri Format| The route to be tested
    

