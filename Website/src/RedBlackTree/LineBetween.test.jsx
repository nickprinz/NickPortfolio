import LineBetween, {getLine} from "./LineBetween";


jest.mock('getLine');

test('should make straighLine', () => {
    const testLine = {xPos:0, yPos: 10, rotate:0, width: 20};
    getLine.mockReturnValueOnce(testLine);
  
    const component = render(<LineBetween />);
    // or you could use the following depending on your use case:
    // axios.get.mockImplementation(() => Promise.resolve(resp))
  
    return Users.all().then(data => expect(data).toEqual(users));
  });

