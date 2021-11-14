// Learn more about F# at http://docs.microsoft.com/dotnet/fsharp

open System
open Day10

[<EntryPoint>]
let main argv =
    printfn "%s" (
        match Environment.GetEnvironmentVariable("part") with
        | null | "part1" -> solutionPart1
        | "part2" -> solutionPart2
        | env -> $"Unknown value {env}"
    )
    0 // return an integer exit code