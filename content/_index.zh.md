---
title: ''
summary: ''
date: 2022-10-24
type: landing

design:
  spacing: '6rem'

sections:
  - block: resume-biography-3
    content:
      username: me-zh
      text: ''
      button:
        text: 下载简历
        url: https://jeffxing.com/uploads/resume.pdf
      headings:
        about: ''
        education: ''
        interests: ''
    design:
      background:
        gradient_mesh:
          enable: true
      name:
        size: md
      avatar:
        size: medium
        shape: circle
  - block: markdown
    content:
      title: '研究方向'
      subtitle: ''
      text: |-
        我的工作贯穿智能系统中相互关联的两个层面：

        * **AI 推理：** 大语言模型与多模态服务、智能体工作流、分布式执行，以及面向异构硬件的性能优化。
        * **视觉智能：** 计算机视觉、三维感知与重建、机器人、ISP/AIISP 和计算摄影。

        我的目标是让智能系统在现实环境中运行得更快、能力更强且更加可靠。
    design:
      columns: '1'
  - block: collection
    id: blog
    content:
      title: 最新研究笔记
      text: 关于 AI 系统、推理技术与视觉智能的深度文章。
      count: 3
      filters:
        folders:
          - blog
        exclude_future: false
        exclude_past: false
    design:
      view: article-grid
      fill_image: true
      columns: 2
  - block: collection
    id: papers
    content:
      title: 论文与专利
      filters:
        folders:
          - publications
        featured_only: false
    design:
      view: citation
---