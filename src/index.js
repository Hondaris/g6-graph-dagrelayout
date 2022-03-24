import G6 from '@antv/g6'
import './styles/style.css'

const graphWork = async (url, w, h) => {
  const responce = await fetch(url)
  const data = await responce.json()

  const graph = new G6.Graph({
    container: 'graph',
    width: w,
    height: h,
    plugins: [toolbar, toolbar1],
    fitView: true,
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    },
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      align: 'DL',
      nodesep: 20,
      ranksep: 50,
      controlPoints: true,
    },
    nodeStateStyles: {
      hover: {
        fill: 'lightsteelblue',
      },
      click: {
        size: [180, 60],
        labelCfg: {
          style: {
            fill: 'black',
            fontSize: 60,
          },
        },
      },
      descriptionCfg: {
        style: {
          fill: '#f00',
        },
      },
    },
    edgeStateStyles: {
      click: {
        stroke: 'steelblue',
      },
    },
    defaultNode: {
      type: 'modelRect',
      size: [60, 20],
      logoIcon: {
        show: false,
      },
      stateIcon: {
        show: false,
      },
      labelCfg: {
        position: 'center',
        style: {
          fill: '#000',
          fontSize: 0,
        },
      },
    },
    defaultEdge: {
      size: 2,
      type: 'polyline',
      style: {
        endArrow: true,
      },
      labelCfg: {
        autoRotate: true,
        style: {
          fontSize: 15,
          radius: 20,
          offset: 45,
          endArrow: true,
          lineWidth: 1,
          stroke: '#C2C8D5',
        },
      },
    },
  })

  graph.data(data)
  graph.render()

  graph.on('node:mouseenter', (e) => {
    const nodeItem = e.item
    graph.setItemState(nodeItem, 'hover', true)
  })

  graph.on('node:mouseleave', (e) => {
    const nodeItem = e.item
    graph.setItemState(nodeItem, 'hover', false)
  })

  graph.on('node:click', (e) => {
    const nodeItem = e.item
    if (nodeItem._cfg.model.size[0] === 180) {
      nodeItem._cfg.model.size = [60, 20]
      nodeItem._cfg.model.labelCfg.style.fontSize = 0
    } else {
      nodeItem._cfg.model.size = [180, 60]
      nodeItem._cfg.model.labelCfg.style.fontSize = 20
    }
    graph.refresh()
  })

  graph.on('edge:click', (e) => {
    const clickEdges = graph.findAllByState('edge', 'click')
    clickEdges.forEach((ce) => {
      graph.setItemState(ce, 'click', false)
    })
    const edgeItem = e.item
    graph.setItemState(edgeItem, 'click', true)
  })
}

const tc = document.createElement('div')
tc.id = 'toolbarContainer'
document.body.appendChild(tc)

const toolbar1 = new G6.ToolBar()
const toolbar = new G6.ToolBar({
  container: tc,
  getContent: () => {
    return `
      <ul id='toolbar__wrap'>
      <li code='deploy'>Развернуть все<li/>
      <input type='text' id='input'/>
      <li code='input' id='find'>Найти<li/>
      <ul/>
    `
  },
  handleClick: (code, graph) => {
    switch (code) {
      case 'deploy':
        graph.cfg.nodes.forEach((node) => {
          node._cfg.model.size = [180, 60]
          node._cfg.model.labelCfg.style.fontSize = 20
        })
        graph.refresh()
        break
      case 'input':
        const filter = document.getElementById('input').value

        graph.cfg.nodes.forEach((node) => {
          if (
            node._cfg.model.label.toLowerCase().includes(filter.toLowerCase())
          ) {
            node._cfg.model.size = [180, 60]
            node._cfg.model.labelCfg.style.fontSize = 20
          } else {
            node._cfg.model.size = [60, 20]
            node._cfg.model.labelCfg.style.fontSize = 0
          }
        })
        graph.refresh()
        break
    }
  },
})

graphWork(
  'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json',
  1500,
  800
)
