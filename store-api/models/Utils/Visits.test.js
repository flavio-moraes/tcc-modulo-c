const Visits = require("./Visits");

const mockConstructor = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockExec = jest.fn();
const mockAggregate = jest.fn();

function Model(data) {
  mockConstructor(data);
  this.counter = 0;
  this.save = mockSave;
}

Model.fIncrement = Visits.fIncrement;
Model.fGetStats = Visits.fGetStats;
Model.findOne = mockFindOne.mockImplementation(() => {
  return Model;
});
Model.exec = mockExec;
Model.aggregate = mockAggregate;

describe("Visits Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fIncrement", () => {
    it("should increment the counter when datelabel exists", async () => {
      mockExec.mockImplementation(() => {
        return Promise.resolve(new Model());
      });

      await Model.fIncrement();
      expect(mockFindOne).toHaveBeenCalledWith({
        datelabel: expect.any(String),
      });
      expect(mockExec).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
    });

    it("should create a new entry when datelabel does not exist", async () => {
      mockExec.mockImplementation(() => {
        return Promise.resolve(null);
      });

      await Model.fIncrement();
      expect(mockExec).toHaveBeenCalled();
      expect(mockConstructor).toHaveBeenCalledWith({
        datelabel: expect.any(String),
        counter: expect.any(Number),
      });
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("fGetStats", () => {
    it("should return monthly stats when n > 0", async () => {
      const data = [{ _id: { month: 5, year: 2023 }, total: 10 }];
      mockAggregate.mockImplementation(() => {
        return Promise.resolve(data);
      });

      const result = await Model.fGetStats(2);
      expect(mockAggregate).toHaveBeenCalledWith(expect.any(Array));
      expect(result).toEqual(data);
    });

    it("should return total stats when n = 0", async () => {
      const data = [{ _id: null, total: 50 }];
      mockAggregate.mockImplementation(() => {
        return Promise.resolve(data);
      });

      const result = await Model.fGetStats(0);
      expect(mockAggregate).toHaveBeenCalledWith(expect.any(Array));
      expect(result).toEqual({ total: 50 });
    });
  });
});
