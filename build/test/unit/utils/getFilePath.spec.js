"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFilePath_1 = __importDefault(require("../../../lib/utils/getFilePath"));
const path_1 = __importDefault(require("path"));
const assert_1 = __importDefault(require("assert"));
describe('getFilePath', function () {
    before(function () {
        this.basePath = process.cwd();
        this.defaultFilename = 'ChromeDriver.txt';
    });
    it('should handle dir "./"', function () {
        const dir = './';
        const expectedPath = path_1.default.join(this.basePath, this.defaultFilename);
        const filePath = getFilePath_1.default(dir, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle dir "./log"', function () {
        const dir = './log';
        const expectedPath = path_1.default.join(this.basePath, dir, this.defaultFilename);
        const filePath = getFilePath_1.default(dir, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle dir "./log/"', function () {
        const dir = './log/';
        const expectedPath = path_1.default.join(this.basePath, dir, this.defaultFilename);
        const filePath = getFilePath_1.default(dir, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle dir "./log/chromedriver"', function () {
        const dir = './log/chromedriver';
        const expectedPath = path_1.default.join(this.basePath, dir, this.defaultFilename);
        const filePath = getFilePath_1.default(dir, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle dir "log"', function () {
        const dir = 'log';
        const expectedPath = path_1.default.join(this.basePath, dir, this.defaultFilename);
        const filePath = getFilePath_1.default(dir, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle file ".log"', function () {
        const file = '.log';
        const expectedPath = path_1.default.join(this.basePath, file);
        const filePath = getFilePath_1.default(file, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle file "./.log"', function () {
        const file = './.log';
        const expectedPath = path_1.default.join(this.basePath, file);
        const filePath = getFilePath_1.default(file, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle file "./log/.log"', function () {
        const file = './log/.log';
        const expectedPath = path_1.default.join(this.basePath, file);
        const filePath = getFilePath_1.default(file, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle file "./chromedriver-log.txt"', function () {
        const file = './chromedriver-log.txt';
        const expectedPath = path_1.default.join(this.basePath, file);
        const filePath = getFilePath_1.default(file, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle file "chromedriver-log.txt"', function () {
        const file = 'chromedriver-log.txt';
        const expectedPath = path_1.default.join(this.basePath, file);
        const filePath = getFilePath_1.default(file, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle file "./log/chromedriver-log.txt"', function () {
        const file = './log/chromedriver-log.txt';
        const expectedPath = path_1.default.join(this.basePath, file);
        const filePath = getFilePath_1.default(file, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
    it('should handle file "log/chromedriver-log.txt"', function () {
        const file = 'log/chromedriver-log.txt';
        const expectedPath = path_1.default.join(this.basePath, file);
        const filePath = getFilePath_1.default(file, this.defaultFilename);
        assert_1.default.strictEqual(filePath, expectedPath);
    });
});
