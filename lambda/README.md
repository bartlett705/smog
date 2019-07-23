Sequence Diagram: 
http://www.plantuml.com/plantuml/uml/LOxDIaCn48NtynH3zhw02wbYaIxKmkt6vUJ76amoPJ91ylPEyIAzs_CTplbsNKbqr08Kb0MVs8FdqIB9HFTuFE0BQVgXwI0rpJgnKFMH89AIfvxmUJQg385BIK4pjuxBsxBEkGyUWljAkJYmRRnxsAxYFNwoL3o-BoVO4AkkNzPHoUTp4lWB3AstXdhynilGmsd_UeDDuP_valiNM69WOtHj3D-3vCjL77QfnL7BBm00
```
      ┌─┐                                                     ,.-^^-._                             ┌─┐    
      ║"│                                                    |-.____.-|                            ║"│    
      └┬┘                                                    |        |                            └┬┘    
      ┌┼┐              |   ,-.                               |        |                            ┌┼┐    
       │               +--{   )            ┌──────┐          |        |        ┌───┐                │     
      ┌┴┐              |   `-'             │lambda│          '-.____.-'        │SNS│               ┌┴┐    
      Bob            API Gateway           └──────┘           Dynamo           └───┘           Your Email 
       │    form POST     │                   │                 │                │                 │      
       │─────────────────>│                   │                 │                │                 │      
       │                  │                   │                 │                │                 │      
       │                  │     trigger       │                 │                │                 │      
       │                  │──────────────────>│                 │                │                 │      
       │                  │                   │                 │                │                 │      
       │                  │                   │   sdk putItem   │                │                 │      
       │                  │                   │ ────────────────>                │                 │      
       │                  │                   │                 │                │                 │      
       │                  │                   │           sdk publish            │                 │      
       │                  │                   │ ────────────────────────────────>│                 │      
       │                  │                   │                 │                │                 │      
       │                  │                   │                 │                │  subscription   │      
       │                  │                   │                 │                │────────────────>│      
      Bob            API Gateway           ┌──────┐           Dynamo           ┌───┐           Your Email 
      ┌─┐              |   ,-.             │lambda│           ,.-^^-._         │SNS│               ┌─┐    
      ║"│              +--{   )            └──────┘          |-.____.-|        └───┘               ║"│    
      └┬┘              |   `-'                               |        |                            └┬┘    
      ┌┼┐                                                    |        |                            ┌┼┐    
       │                                                     |        |                             │     
      ┌┴┐                                                    '-.____.-'                            ┌┴┐    
```