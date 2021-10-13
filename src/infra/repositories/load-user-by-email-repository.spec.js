class LoadUserByEmailRepository {
  async load(email) {
    return null;
  }
}

describe('LoadUserByEmail Repository', () => {
  it('should returns null when user is"nt found', async () => {
    const sut = new LoadUserByEmailRepository();
    const user = await sut.load('invalid@gmail.com');
    expect(user).toBeNull();
  });
});
