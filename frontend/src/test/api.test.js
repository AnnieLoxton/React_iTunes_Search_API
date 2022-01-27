//testing the API by adding a search term to the URL.

test('Does the API work correctly' , async () => {

    const getMethod = await fetch("https://itunes.apple.com/search?drake");
    
    expect(getMethod).toBeDefined();
    
    const conversion = await getMethod.json();
    
    expect(conversion).toBeTruthy();
    })