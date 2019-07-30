Sequence Diagram: 
http://www.plantuml.com/plantuml/png/LOxFIiSm48Jl-nHBxhw01_afYXH42_NYSVF76aooPRD1ylQcLiHUvnjclajL4cqv0JbbmJksOBaLJzBHtCuJFfA6B-e6Gj6e7HDbwmayALcg0UzxeSpWEANWD7Afk3mlltFcZPlWGwQO38njlBevh-8rlhDad5-MLpYJKNtw-HeTbRYkGU0utz5nEr3rdxWrdJJaVtWe_36ROls0aGnmCjeRpLOdSTl5uHAARpbz0m00
```
┌─┐                                                     ,.-^^-._                             ┌─┐    
║"│                                                    |-.____.-|                            ║"│    
└┬┘                                                    |        |                            └┬┘    
┌┼┐              |   ,-.                               |        |                            ┌┼┐    
 │               +--{   )            ┌──────┐          |        |        ┌───┐                │     
┌┴┐              |   `-'             │Lambda│          '-.____.-'        │SNS│               ┌┴┐    
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
┌─┐              |   ,-.             │Lambda│           ,.-^^-._         │SNS│               ┌─┐    
║"│              +--{   )            └──────┘          |-.____.-|        └───┘               ║"│    
└┬┘              |   `-'                               |        |                            └┬┘    
┌┼┐                                                    |        |                            ┌┼┐    
 │                                                     |        |                             │     
┌┴┐                                                    '-.____.-'                            ┌┴┐    
```