import createEngine, {
	DefaultNodeModel,
	DiagramModel,
} from '@projectstorm/react-diagrams';
import { AdvancedLinkFactory, AdvancedPortModel } from './helper/ArrowHead';

import { CanvasWidget } from '@projectstorm/react-canvas-core';

const engineTest = () => {
	const engine = createEngine();
	engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());

	// node 1
	const node1 = new DefaultNodeModel({
		name: 'Source',
		color: 'rgb(0,192,255)',
	});
	node1.setPosition(100, 100);
	let port1 = node1.addPort(new AdvancedPortModel(true, 'out'));

	// node 2
	const node2 = new DefaultNodeModel({
		name: 'Destination',
		color: 'rgb(192,255,0)',
	});
	node2.setPosition(400, 100);
	let port2 = node2.addPort(new AdvancedPortModel(true, 'in'));

	const model = new DiagramModel();
	model.registerListener({
		eventDidFire: async (event) => {
			const entity = event.entity;
			const components = entity.getNodes().map((node) => {
				return {
					id: node.getOptions().id,
					name: node.getOptions().name,
				};
			});
			const links = entity.getLinks().map((link) => {
				return {
					src: link.sourcePort.parent.options.name,
					desc: link.targetPort.parent.options.name,
				};
			});

			await fetch('/api/state/cache', {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					components,
					links,
				}),
			});
		},
	});
	const link1 = port1.link(port2);
	let models = model.addAll(node1, node2, link1);

	models.forEach((element) => {
		element.registerListener({
			eventDidFire: (event) => {
				console.log();
				console.log(
					`[${event.entity.getOptions().name}]:${event.function} was called`,
				);
			},
		});
	});

	engine.setModel(model);
	return <CanvasWidget className='engineTest' engine={engine} />;
};

export default engineTest;
