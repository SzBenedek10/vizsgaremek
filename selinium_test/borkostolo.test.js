const { Builder, By, until } = require('selenium-webdriver');

async function runBorkostoloTest() {
    console.log("Borkóstoló teszt indítása...");
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173/login');

        await driver.wait(until.elementLocated(By.name('email')), 5000);


        console.log("   -> Hitelesítő adatok megadása...");
        await driver.findElement(By.name('email')).sendKeys('admin@gmail.com');
        await driver.findElement(By.name('password')).sendKeys('Anyad1982@');
        
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        await driver.sleep(3000);

        await driver.get('http://localhost:5173/borkostolas');
        
        await driver.sleep(2000);

        let valasztGomb = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Foglalás") or contains(text(), "Kiválaszt")]')), 5000);
        
        await driver.executeScript("arguments[0].click();", valasztGomb);

        await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Foglalás véglegesítése")]')), 5000);

        let checkboxes = await driver.findElements(By.css('input[type="checkbox"]'));
        for (let checkbox of checkboxes) {
            await driver.executeScript("arguments[0].click();", checkbox);
            await driver.sleep(500);
        }
        let veglegesitGomb = await driver.findElement(By.xpath('//button[contains(text(), "Foglalás véglegesítése")]'));
        await driver.executeScript("arguments[0].click();", veglegesitGomb);
        await driver.sleep(3000);
        console.log("TESZT SIKERES: A borkóstoló foglalás lefutott!");

    } catch (error) {
        console.error("TESZT ELBUKOTT. A hiba oka:", error);
    } finally {
        console.log("Böngésző bezárása...");
        await driver.quit();
    }
}
runBorkostoloTest();