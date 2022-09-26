import { DigiwfConfig, DigiwfLib } from "./digiwf-lib";
import { Success } from "./types";
import * as fs from "fs";

const pathToProject = "resources/my-process-automation-project/";
const project = "my-process-automation-project";
const target = "http://localhost:8080";

const config: DigiwfConfig = {
    deploymentPlugins: [
        {
            name: "rest",
            targetEnvironments: [],
            deploy: function(target: string) {
                return new Promise<Success>(resolve => resolve({
                    success: true,
                    message: `Deployed to ${target}`
                }));
            }
        }
    ]
};

const digiwfLib = new DigiwfLib(config);

describe("deployArtifact", () => {
    it("should work", async () => {
        const file = `${pathToProject}my-process.bpmn`;
        const type = "BPMN";

        const deploymentSuccess = await digiwfLib.deployArtifact(file, type, project, target);

        expect(deploymentSuccess.success).toBeTruthy();
        expect(deploymentSuccess.message).toEqual("Everything is deployed successfully");
    });

    it("should raise an error", async () => {
        return digiwfLib.deployArtifact(pathToProject, "BPMN", project, target)
            .catch(e => expect(e).not.toBeNull());
    });
});

describe("deployAllArtifacts", () => {
    it("should work", async () => {
        const target = "http://localhost:8080";

        const deploymentSuccesses = await digiwfLib.deployAllArtifacts(pathToProject, project, target);

        deploymentSuccesses.forEach(deploymentSuccess => {
            expect(deploymentSuccess.success).toBeTruthy();
            expect(deploymentSuccess.message).toEqual("Everything is deployed successfully");
        });
    });

    it("should raise an error", async () => {
        return digiwfLib.deployAllArtifacts("/path/does-not/exist", project, target)
            .catch(e => expect(e).not.toBeNull());
    });
});


describe("generateProcess", () => {
    const pathToGenerations = "resources/my-generations";

    it("should raise an error", async () => {
        const generateSuccesses = await digiwfLib.generateProcess("bpmn", "errorFile", `${pathToGenerations}/error`);
        expect(generateSuccesses.success).toBeFalsy();
        expect(generateSuccesses.message).toBe(`Failed to generate ${pathToGenerations}/error/errorFile.bpmn`);
    });

    it("should not work", async () => {
        const generateSuccesses = await digiwfLib.generateProcess("typo", "typoFile", pathToGenerations);
        expect(generateSuccesses.success).toBeFalsy();
        expect(generateSuccesses.message).toBe(`The given type: "typo" is not supported`);
    });

    it("BPMN should work", async () => {
        //careful, defaultBPMN is hardcoded
        const defaultBPMN: string =
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:modeler=\"http://camunda.org/schema/modeler/1.0\" id=\"Definitions_0sduois\" targetNamespace=\"http://bpmn.io/schema/bpmn\" exporter=\"Camunda Modeler\" exporterVersion=\"5.2.0\" modeler:executionPlatform=\"Camunda Platform\" modeler:executionPlatformVersion=\"7.17.0\">\n" +
            "  <bpmn:process id=\"testFile_uuid\" name=\"testFile\" isExecutable=\"true\">\n" +
            "    <bpmn:documentation>doc</bpmn:documentation>\n" +
            "    <bpmn:extensionElements />\n" +
            "    <bpmn:startEvent id=\"StartEvent_1\" />\n" +
            "  </bpmn:process>\n" +
            "  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n" +
            "    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"testFile_uuid\">\n" +
            "      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n" +
            "        <dc:Bounds x=\"179\" y=\"79\" width=\"36\" height=\"36\" />\n" +
            "      </bpmndi:BPMNShape>\n" +
            "    </bpmndi:BPMNPlane>\n" +
            "  </bpmndi:BPMNDiagram>\n" +
            "</bpmn:definitions>\n"

        if(fs.existsSync(`${pathToGenerations}/testFile.bpmn`)){
            fs.unlinkSync(`${pathToGenerations}/testFile.bpmn`)
        }

        const generateSuccesses = await digiwfLib.generateProcess("bpmn", "testFile", pathToGenerations);
        expect(generateSuccesses.success).toBeTruthy();
        expect(generateSuccesses.message).toBe(`Generated ${pathToGenerations}/testFile.bpmn successfully`);
        expect(fs.readFileSync(`${pathToGenerations}/testFile.bpmn`).toString()).toEqual(defaultBPMN);

        fs.unlinkSync(`${pathToGenerations}/testFile.bpmn`)
    });

    it("DMN should work", async () => {
        const defaultDMN =
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<definitions xmlns=\"https://www.omg.org/spec/DMN/20191111/MODEL/\" xmlns:dmndi=\"https://www.omg.org/spec/DMN/20191111/DMNDI/\" xmlns:dc=\"http://www.omg.org/spec/DMN/20180521/DC/\" xmlns:modeler=\"http://camunda.org/schema/modeler/1.0\" id=\"testFile_uuid\" name=\"testFile\" namespace=\"http://camunda.org/schema/1.0/dmn\" exporter=\"Camunda Modeler\" exporterVersion=\"5.2.0\" modeler:executionPlatform=\"Camunda Platform\" modeler:executionPlatformVersion=\"7.17.0\">\n" +
            "  <decision id=\"Decision_1ja0uxu\" name=\"Decision 1\">\n" +
            "    <decisionTable id=\"DecisionTable_1shndzu\">\n" +
            "      <input id=\"Input_1\">\n" +
            "        <inputExpression id=\"InputExpression_1\" typeRef=\"string\">\n" +
            "          <text></text>\n" +
            "        </inputExpression>\n" +
            "      </input>\n" +
            "      <output id=\"Output_1\" typeRef=\"string\" />\n" +
            "    </decisionTable>\n" +
            "  </decision>\n" +
            "  <dmndi:DMNDI>\n" +
            "    <dmndi:DMNDiagram>\n" +
            "      <dmndi:DMNShape dmnElementRef=\"Decision_1ja0uxu\">\n" +
            "        <dc:Bounds height=\"80\" width=\"180\" x=\"160\" y=\"100\" />\n" +
            "      </dmndi:DMNShape>\n" +
            "    </dmndi:DMNDiagram>\n" +
            "  </dmndi:DMNDI>\n" +
            "</definitions>\n"

        if(fs.existsSync(`${pathToGenerations}/testFile.dmn`)){
            fs.unlinkSync(`${pathToGenerations}/testFile.dmn`)
        }

        const generateSuccesses = await digiwfLib.generateProcess("dmn", "testFile", pathToGenerations);
        expect(generateSuccesses.success).toBeTruthy();
        expect(generateSuccesses.message).toBe(`Generated ${pathToGenerations}/testFile.dmn successfully`);
        expect(fs.readFileSync(`${pathToGenerations}/testFile.dmn`).toString()).toEqual(defaultDMN);

        fs.unlinkSync(`${pathToGenerations}/testFile.dmn`)
    });

});
