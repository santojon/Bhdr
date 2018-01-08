import { Selector } from 'testcafe'

fixture('Test browser').page('./index.html')
test('Bhdr', async (t) => {
    await(t)
        .expect(Selector('#result').innerText).eql('{}')
})