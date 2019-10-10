# Lovoo JS

Das ist ein nicht offizielles NodeJS Package, welches zum Spass erstellt wurde, um ein paar Sachen auszuprobieren.

[Hier befindet sich der Release der NPM Package](https://www.npmjs.com/package/lovoo-js)
[Hier befindet sich das Git Repository](https://github.com/DavAlbert/lovoo-js)


## Installation
```
$ npm install lovoo-js --save
```

## Einführung

Dieses NPM Package ist nicht von der Herrstellern von Lovoo erstellt worden und kann bei größeren Plattform Änderungen nicht mehr funktionieren. Deswegen würde ich mich bei Bugs über Benachrichtigungen freuen: garkolym@gmail.com

```javascript
const lovoojs = require('lovoo-js');
const client = new lovoojs.LovooClient();

async function example() {
    const myData = await client.login('max.mustermann@web.de', 'geheimespasswort');
    console.log(myData);

    /*
    Beispiel Ausgabe:
    {
        id: 'XXX5be4b0XXXXXXX836aXXXX',
        name: 'Max',
        freetext: 'Benutze kein Lovoo mehr',
        country: 'DE',
        city: 'Hamburg',
        age: 22,
        gender: 1,
        email: 'max.mustermann@web.de',
        credits: 5999,
        birthday: '02.02.1996',
        genderLooking: 2
    }
    */
}

example();
```

## Dieses Package befindet sich momentan in der Alpha Phase, weshalb noch nicht so viele Methoden existieren.

### Disclaimer

Dies ist keine offizielle Lovoo-App und kann daher gegen die Nutzungsbedingungen von Lovoo verstoßen. Wie bei jeder experimentellen Technologie sollten Sie auch hier mit Vorsicht vorgehen.