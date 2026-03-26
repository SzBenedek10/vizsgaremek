const { Builder, By, until } = require('selenium-webdriver');

async function kosarTeszt() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173/login');
        await driver.wait(until.elementLocated(By.css('input[name="email"]')), 5000);
        await driver.findElement(By.css('input[name="email"]')).sendKeys('gibszjakab900@gmail.com');
        await driver.findElement(By.css('input[name="password"]')).sendKeys('Premo900'); 
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.wait(async () => {
            let currentUrl = await driver.getCurrentUrl();
            return currentUrl !== 'http://localhost:5173/login'; 
        }, 10000); 
        await driver.get('http://localhost:5173/borrendeles');
        let reszletekGomb = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Részletek')] | //button[contains(., 'Részletek')]")), 5000);
        await reszletekGomb.click();
        let kosarbaGomb = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Kosárba')]")), 5000);
        await kosarbaGomb.click();
        await driver.sleep(2000); 
        await driver.get('http://localhost:5173/checkout');
        await driver.wait(until.elementLocated(By.css('input[name="nev"]')), 5000);
        console.log("Sikeres Bejelentkezés");
    } catch (hiba) {
        console.error("A TESZT ELBUKOTT:", hiba.message);
        let finalUrl = await driver.getCurrentUrl();
        console.log("Ahol elakadt", finalUrl);
    } finally {
        await driver.quit(); 
    }
}

kosarTeszt();