export interface DockerComposeGeneratorSchema {
    name?: string;
    tags?: string;
    directory?: string;
}

interface DockerApplication {
    name: string;
    port: number;
    path: string;
}

type TemplateType = { [key: string]: string | DockerApplication[] }