import { availableGeneratorPlugins } from "./plugins";

const filesToGenerate = [
    {name: "process-ide", type: "process-ide.json", extension: "json", dir: ""},
    {name: "my-process", type: "bpmn", extension: "bpmn", dir: ""},
    {name: "my-decision-table", type: "dmn", extension: "dmn", dir: ""},
    {name: "my-form", type: "form", extension: "form", dir: "forms"},
    {name: "my-config", type: "config", extension: "json", dir: "configs"},
    {name: "my-element-template", type: "element-template", extension: "json", dir: "element-templates"},
    {name: "README", type: "README.md", extension: "md", dir: ""}
];

describe("generators", () => {
    for (const file of filesToGenerate) {
        it(`${file.type} generator should work`, async () => {
            // check if generator exists
            expect(availableGeneratorPlugins.get(file.type)).toBeTruthy();

            const generator = availableGeneratorPlugins.get(file.type);

            if (!generator) {
                fail("Generator does not exist");
            }

            // check file creation
            const artifact = await generator.generate(file.name, "test-project");
            expect(artifact.type).toEqual(file.type);
            expect(artifact.project).toEqual("test-project");
            expect(artifact.file.name).toEqual(file.name);
            expect(artifact.file.pathInProject).toEqual(`/${file.dir}/${file.name}.${file.extension}`.replace("//", "/"));
            expect(artifact.file.extension).toEqual(file.extension);
        });
    }

    it(".gitkeep generator should work", async () => {
        // check if generator exists
        expect(availableGeneratorPlugins.get(".gitkeep")).toBeTruthy();

        const generator = availableGeneratorPlugins.get(".gitkeep");

        if (!generator) {
            fail("Generator does not exist");
        }

        // check file creation
        const artifact = await generator.generate("some-directory", "test-project");
        expect(artifact.type).toEqual(".gitkeep");
        expect(artifact.project).toEqual("test-project");
        expect(artifact.file.name).toEqual(".gitkeep");
        expect(artifact.file.pathInProject).toEqual("/some-directory/.gitkeep");
        expect(artifact.file.extension).toEqual("");
    });
});
