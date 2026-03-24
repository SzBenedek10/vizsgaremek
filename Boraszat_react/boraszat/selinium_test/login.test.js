const { Builder, By, until } = require('selenium-webdriver');

async function loginTeszt() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173/login');
        await driver.wait(until.elementLocated(By.css('input[name="email"]')), 5000);
        await driver.findElement(By.css('input[name="email"]')).sendKeys('gibszjakab900@gmail.com');
        await driver.findElement(By.css('input[name="password"]')).sendKeys('Premo900'); 
        let loginGomb = await driver.findElement(By.xpath("//button[contains(text(), 'Belépés')]"));
        await loginGomb.click();
        try {
            let swal = await driver.wait(until.elementLocated(By.id('swal2-title')), 3000);
            let swalSzoveg = await swal.getText();
        } catch (e) {
            console.warn("Hiba", e);
        }
        await driver.wait(async () => {
            let currentUrl = await driver.getCurrentUrl();
            return currentUrl !== 'http://localhost:5173/login'; 
        }, 10000); 
    } catch (hiba) {
        console.error("A TESZT ELBUKOTT:", hiba.message);
        
        let finalUrl = await driver.getCurrentUrl();
        console.log("Ahol elakadt", finalUrl);
    } finally {
        await driver.quit(); 
    }
}

loginTeszt();