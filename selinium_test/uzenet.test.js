const { Builder, By, until } = require('selenium-webdriver');

async function runKapcsolatTest() {
    console.log("✉️ Kapcsolat oldal teszt indítása...");
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173/login'); 
        await driver.wait(until.elementLocated(By.name('email')), 5000);
        await driver.findElement(By.name('email')).sendKeys('admin@gmail.com');
        await driver.findElement(By.name('password')).sendKeys('Anyad1982@');
        let loginGomb = await driver.findElement(By.css('button[type="submit"]'));
        await driver.executeScript("arguments[0].click();", loginGomb);
        await driver.sleep(3000);

        await driver.get('http://localhost:5173/kapcsolat');
        
        await driver.sleep(2000);

        let targyInput = await driver.wait(until.elementLocated(By.xpath("//input[contains(@class, 'MuiInputBase-input') and not(@type='hidden')]")), 5000);
        let uzenetInput = await driver.findElement(By.xpath("//textarea[contains(@class, 'MuiInputBase-input')]"));

        await targyInput.sendKeys('Teszt Üzenet');
        await uzenetInput.sendKeys('Ez egy Selenium Teszt.');

        let kuldesGomb = await driver.findElement(By.xpath('//button[contains(text(), "Üzenet elküldése")]'));
        await driver.executeScript("arguments[0].click();", kuldesGomb);

        await driver.sleep(3000);
        
        console.log("TESZT SIKERES: A bejelentkezés és az üzenetküldés hibátlanul lefutott!");

    } catch (error) {
        console.error("TESZT ELBUKOTT. A hiba oka:", error);
    } finally {
        await driver.quit();
    }
}
runKapcsolatTest();