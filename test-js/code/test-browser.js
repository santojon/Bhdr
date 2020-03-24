import { Selector } from 'testcafe'

fixture('Test browser').page('./index.html')
test('Base', async (t) => {
    await(t)
        .expect(Selector('#base').innerText).eql('{}')
})