import {copyAndFillStructure, generateStructure} from "./generate";
import * as fs from "fs";
import * as os from "os";
import {Success} from "../types";

function safeDelDir(dirPath: string) {
    if(fs.existsSync(dirPath)){
        fs.rmSync(dirPath, { recursive: true, force: true });
    }
}

function expTruthy(successes: Success) {
    expect(successes.success).toBeTruthy();
    expect(successes.message).toBe(`Generated successfully`);
}

function expFalsy(successes: Success) {
    expect(successes.success).toBeFalsy();
    expect(successes.message).toBe(`Project already exists`);
}

const projectPath = "resources/my-generations/basic-project";
const path = "resources/my-generations";


beforeEach( () => {
    safeDelDir(projectPath)
});

afterAll( () => {
    safeDelDir(projectPath)
})


describe("copyProject", () => {

    it("should work without path", async () => {
        expTruthy(await copyAndFillStructure("basic-project"));
    });

    it("should work with absolute path outside of project", async () => {
        const projectPath = `${os.homedir()}/Desktop/Desktop-project`;
        const path = `${os.homedir()}/Desktop`;

        safeDelDir(projectPath);
        expTruthy(await copyAndFillStructure("Desktop-project", path));
        safeDelDir(projectPath);
    });

    it("should fail, due to already existing directory", async () => {
        await copyAndFillStructure ("basic-project");
        expFalsy(await copyAndFillStructure ("basic-project"));
    });

    it("should work to overwrite a project", async () => {
        await copyAndFillStructure ("basic-project", path);
        expTruthy(await copyAndFillStructure ("basic-project",path, true));
    });
});

//------------------------------ Legacy Code ------------------------------//
describe("oldGenerateProject", () => {

    it("should work", async () => {
        const projectPath = "resources/ProjectTest";
        const path = "resources";
        safeDelDir(projectPath);
        expTruthy(await generateStructure("ProjectTest", path));
        safeDelDir(projectPath);
    });

    it("should work without path", async () => {
        expTruthy(await generateStructure("basic-project"));
    });

    it("should work with absolute path outside of project", async () => {
        const projectPath = `${os.homedir()}/Desktop/basic-project`;
        const path = `${os.homedir()}/Desktop`;

        safeDelDir(projectPath);
        expTruthy(await generateStructure("basic-project", path));
        safeDelDir(projectPath);
    });

    it("should fail, due to already existing directory", async () => {
        await generateStructure ("basic-project");
        expFalsy(await generateStructure ("basic-project"));
    });

    it("should work to overwrite a project", async () => {
        await generateStructure ("basic-project", path);
        expTruthy(await generateStructure ("basic-project",path, true));
    });

});
