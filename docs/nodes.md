## Demo notes
Ausgangssituation: Standard Token Contract + simple GUI + Upchain Infra

Was man an der Demo zeigen kann:
* Link zu Contract und wie dieser gespeichert wird + Metadaten sind öffentlich (stress this point!!!)
* Link zu den beiden Adressen von Alice und Bob (aber pseudonym, man weiss nicht wer es ist) und den durchgeführten Transaktionen -> Schreiben hinterlässt Spuren in der Blockchain. Lesen nicht (jeder kann unbemerkt lesen)!
* Tokens können von Alice zu Bob überwiesen werden (Ratz-fatz -> quasi in Echtzeit - läuft alles immer mit 15 Sekunden Blockzeit ab).
* Wichtig: Alice und Bob sollten jeweils private keys halten (in der demo liegen die Keys einfach auf der Node)
* Tokens können jedes digitale Asset (via Hash) oder Assets, die eindeutig beschrieben werden können, repräsentieren
* Alice (Bob) kann Bob (Alice) berechtigen, über eigene Tokens zu verfügen (ähnlich einer Lastschrift)
* Fehlermeldung werden sinnvollerweise im Browser abgefangen, nicht im Smart Contract
* Gas-Konzept bei Transaktionen


Was bringt Upchain dabei Tolles mit:
* Demo funktioniert einfach im Internet und kann zugänglich gemacht werden (z.B. für Review) ohne, dass sich Mitarbeiter die vollst. Infra installieren
* Sichere Verbindung zur Node (nicht jeder kann einfach zugreifen und Transaktionen durchführen)
* Tool-kit um die Anwendung zu erstellen (nur Front-End und Smart contract müssen entwickelt werden) sowie zusätzliche Libraries (z.B. Signaturen im Browser)


Was noch kommen sollte
* Link zum Monitoring/Logging (aus dem Transaktionslog), anstelle von Blockchain Explorer
