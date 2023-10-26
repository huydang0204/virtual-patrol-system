import {
  expect,
  test,
  describe
} from "@jest/globals";

export type ExecuteTime = {
  startTime : number,
  endTime : number
}

function areExecuteTimeOverlapping(interval1 : ExecuteTime, interval2 : ExecuteTime) : boolean {
  return interval1.startTime < interval2.endTime && interval1.endTime > interval2.startTime;

}

/**
 *     30------40
 *
 *             40-----50
 *
 *20---30
 *
 *   25----35
 *
 *          35------45
 *
 */

describe("ExecutionTime Overlapping Testing", () => {

  const pivotInterval : ExecuteTime = {
    startTime : 30,
    endTime : 40
  };

  test("Come from front and Should ok without overlapping", async () => {
    const checkedInterval : ExecuteTime = {
      startTime : 40,
      endTime : 50
    };
    const result = areExecuteTimeOverlapping(checkedInterval, pivotInterval);
    expect(result).toEqual(false);

  });

  test("come from back and Should ok without overlapping", async () => {
    const checkedInterval : ExecuteTime = {
      startTime : 20,
      endTime : 30
    };
    const result = areExecuteTimeOverlapping(checkedInterval, pivotInterval);
    expect(result).toEqual(false);

  });

  test("come from front and Should be not ok by overlapping", async () => {
    const checkedInterval : ExecuteTime = {
      startTime : 25,
      endTime : 35
    };
    const result = areExecuteTimeOverlapping(checkedInterval, pivotInterval);
    expect(result).toEqual(true);

  });

  test("come from front and Should be not ok by overlapping", async () => {
    const checkedInterval : ExecuteTime = {
      startTime : 35,
      endTime : 45
    };
    const result = areExecuteTimeOverlapping(checkedInterval, pivotInterval);
    expect(result).toEqual(true);

  });
  ////////////////////////////////

  test("Come from front and Should ok without overlapping (reverse)", async () => {
    const checkedInterval : ExecuteTime = {
      startTime : 40,
      endTime : 50
    };
    const result = areExecuteTimeOverlapping(pivotInterval, checkedInterval);
    expect(result).toEqual(false);

  });

  test("come from back and Should ok without overlapping (reverse)", async () => {
    const checkedInterval : ExecuteTime = {
      startTime : 20,
      endTime : 30
    };
    const result = areExecuteTimeOverlapping(pivotInterval, checkedInterval);
    expect(result).toEqual(false);

  });

  test("come from front and Should be not ok by overlapping (reverse)", async () => {
    const checkedInterval : ExecuteTime = {
      startTime : 25,
      endTime : 35
    };
    const result = areExecuteTimeOverlapping(pivotInterval, checkedInterval);
    expect(result).toEqual(true);

  });

  test("come from front and Should be not ok by overlapping (reverse)", async () => {
    const checkedInterval : ExecuteTime = {
      startTime : 35,
      endTime : 45
    };
    const result = areExecuteTimeOverlapping(pivotInterval, checkedInterval);
    expect(result).toEqual(true);

  });

});

interface DateInterval {
  start : Date;
  end : Date;
}

function areDatesOverlapping(interval1 : DateInterval, interval2 : DateInterval) : boolean {
  return interval1.start <= interval2.end && interval1.end >= interval2.start;
}

/**
 *     20------25
 *
 *             25-----27
 *
 *15---20
 *
 *   17----23
 *
 *         23------27
 *
 */

describe("Date Overlapping Testing", () => {

  const pivotInterval : DateInterval = {
    start : new Date("2023-07-20"),
    end : new Date("2023-07-25")
  };

  test("Come from front and Should ok without overlapping", async () => {
    const checkedInterval : DateInterval = {
      start : new Date("2023-07-25"),
      end : new Date("2023-07-27")
    };
    const result = areDatesOverlapping(checkedInterval, pivotInterval);
    expect(result).toEqual(true);

  });

  test("come from back and Should ok without overlapping", async () => {
    const checkedInterval : DateInterval = {
      start : new Date("2023-07-15"),
      end : new Date("2023-07-20")
    };
    const result = areDatesOverlapping(checkedInterval, pivotInterval);
    expect(result).toEqual(true);

  });

  test("come from front and Should be not ok by overlapping", async () => {
    const checkedInterval : DateInterval = {
      start : new Date("2023-07-17"),
      end : new Date("2023-07-23")
    };
    const result = areDatesOverlapping(checkedInterval, pivotInterval);
    expect(result).toEqual(true);

  });

  test("come from front and Should be not ok by overlapping", async () => {
    const checkedInterval : DateInterval = {
      start : new Date("2023-07-23"),
      end : new Date("2023-07-27")
    };
    const result = areDatesOverlapping(checkedInterval, pivotInterval);
    expect(result).toEqual(true);

  });
  ////////////////////////////////

  test("Come from front and Should ok without overlapping", async () => {
    const checkedInterval : DateInterval = {
      start : new Date("2023-07-25"),
      end : new Date("2023-07-27")
    };
    const result = areDatesOverlapping(pivotInterval, checkedInterval);
    expect(result).toEqual(true);

  });

  test("come from back and Should ok without overlapping", async () => {
    const checkedInterval : DateInterval = {
      start : new Date("2023-07-15"),
      end : new Date("2023-07-20")
    };
    const result = areDatesOverlapping(pivotInterval, checkedInterval);
    expect(result).toEqual(true);

  });

  test("come from front and Should be not ok by overlapping", async () => {
    const checkedInterval : DateInterval = {
      start : new Date("2023-07-17"),
      end : new Date("2023-07-23")
    };
    const result = areDatesOverlapping(pivotInterval, checkedInterval);
    expect(result).toEqual(true);

  });

  test("come from front and Should be not ok by overlapping", async () => {
    const checkedInterval : DateInterval = {
      start : new Date("2023-07-23"),
      end : new Date("2023-07-27")
    };
    const result = areDatesOverlapping(pivotInterval, checkedInterval);
    expect(result).toEqual(true);

  });

});
