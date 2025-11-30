```mermaid
flowchart TB
  subgraph Landing
    LHeader[Logo | Nav]
    LHero[Hero: Title, CTA]
    LFeatures[Feature tiles]
  end

  subgraph AdminDashboard
    ALeft[SideNav]
    AMain[Cards + Quick Actions]
    ARight[Summary]
    ALeft --> AMain
    AMain --> ARight
  end

  subgraph Analytics
    FFilters[Filters: Date, Course, Form]
    FOverview[Overview cards]
    FCharts[BarChart + Sparklines]
    FFilters --> FOverview
    FOverview --> FCharts
  end

  classDef header fill:#eee,stroke:#333

```

Each block above maps to a visual region for low-fidelity mockups. If you want PNGs, I can convert these into simple SVG/PNG layouts next.
