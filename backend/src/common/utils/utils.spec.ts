import { InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { RandomHelper } from "./random.helper";
import { ServiceHelper } from "./service.helper";

describe('Utils', () => {
    describe("randomGenerator", () => {
        describe("Random number generator", () => {
            it('should generate a random number of a given length', () => {
                const length = 5;
                const result = RandomHelper.generateRandomNumber(length);
                expect(result.toString().length).toBe(length);
            });
        });
        describe("Random string generator", () => {
            it('should generate a random string of a given length', () => {
                const length = 5;
                const result = RandomHelper.generateRandomString(length);
                expect(result.length).toBe(length);
            });
        });
        it("should not be predictable", () => {
            const length = 3;
            const result1 = RandomHelper.generateRandomString(length);
            const result2 = RandomHelper.generateRandomString(length);
            const result3 = RandomHelper.generateRandomString(length);
            const result4 = RandomHelper.generateRandomString(length);
            expect(result1).not.toEqual(result2);
            expect(result2).not.toEqual(result3);
            expect(result3).not.toEqual(result4);
        });
    });
    describe("Service Helper", () => {
        describe("handleServiceError", () => {
            it("should throw an InternalServerErrorException if the error is not an HttpException", () => {
                const error = new Error();
                const fallback = "An error occurred";
                try {
                    ServiceHelper.handleServiceError(error, fallback);
                } catch (e) {
                    expect(e).toBeInstanceOf(InternalServerErrorException);
                    expect(e.message).toBe(fallback);
                }
            });
            it("should throw the error if it is an HttpException", () => {
                const message = "Unauthorized";
                const error = new UnauthorizedException(message);
                const fallback = "An error occurred";
                try {
                    ServiceHelper.handleServiceError(error, fallback);
                } catch (error) {
                    expect(error).toBeInstanceOf(UnauthorizedException);
                    expect(error.message).toBe(message);
                }
            });
        });
    });
});