const { Builder, By, until } = require('selenium-webdriver');

async function teljesRendelesTeszt() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173/login');
        await driver.wait(until.elementLocated(By.name('email')), 5000);
        await driver.findElement(By.name('email')).sendKeys('gibszjakab900@gmail.com');
        await driver.findElement(By.name('password')).sendKeys('Premo900'); 
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.wait(async () => {
            return (await driver.getCurrentUrl()) !== 'http://localhost:5173/login'; 

        }, 10000); 
        await driver.get('http://localhost:5173/borrendeles');
        let reszletekGomb = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Részletek')] | //button[contains(., 'Részletek')]")), 5000);
        await reszletekGomb.click();

        let kosarbaGomb = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Kosárba')]")), 5000);
        await kosarbaGomb.click();

        await driver.sleep(1500); 

        await driver.get('http://localhost:5173/checkout');

        await driver.wait(until.elementLocated(By.name('nev')), 5000);
        await driver.findElement(By.name('nev')).sendKeys('Sinthavong Bence');
        let emailMezo = await driver.findElement(By.name('email'));

        await emailMezo.clear(); 
        await emailMezo.sendKeys('gibszjakab900@gmail.com');
        await driver.findElement(By.name('tel')).sendKeys('06303216634');
        await driver.findElement(By.name('irsz')).sendKeys('8314');
        await driver.findElement(By.name('varos')).sendKeys('Vonyarcvasshegy');
        await driver.findElement(By.name('utca')).sendKeys('Petőfi utca');
        await driver.findElement(By.name('hazszam')).sendKeys('14');

        let over18Label = await driver.findElement(By.xpath("//*[contains(text(), 'Igen, elmúltam 18 éves')]"));
        await over18Label.click();

        let aszfLink = await driver.findElement(By.xpath("//*[contains(text(), 'Elfogadom')]//*[contains(text(), 'ÁSZF')] | //a[contains(text(), 'ÁSZF')] | //span[contains(text(), 'ÁSZF')]"));
        await aszfLink.click();

        let aszfElfogadGomb = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Elolvastam és elfogadom')]")), 5000);
        await driver.wait(until.elementIsVisible(aszfElfogadGomb), 5000);
        await aszfElfogadGomb.click();

        await driver.sleep(1000);
        let megrendelGomb = await driver.findElement(By.xpath("//button[contains(., 'Fizetési kötelezettséggel')]"));
        await megrendelGomb.click();

        let swalOkGomb = await driver.wait(until.elementLocated(By.css('.swal2-confirm')), 8000);
        await driver.wait(until.elementIsVisible(swalOkGomb), 5000);
        await swalOkGomb.click();
        await driver.wait(until.urlIs('http://localhost:5173/'), 5000); 
        console.log("Sikeres teszt");

    } catch (hiba) {
        console.error("A TESZT ELBUKOTT:", hiba.message);
        let finalUrl = await driver.getCurrentUrl();
        console.log("Ahol elakadt", finalUrl);
    } finally {
        await driver.quit(); 
    }
}

teljesRendelesTeszt();