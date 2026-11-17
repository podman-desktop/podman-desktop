/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

export default {
  'kubernetes.resources.summary': '概要',
  'kubernetes.resources.inspect': '検査',
  'kubernetes.resources.loading': '読み込み中...',
  'kubernetes.resources.detailsError': '{name} の Kubernetes 詳細を取得できません',
  'kubernetes.resources.switchContext': '別のコンテキストまたは名前空間に切り替えてください',
  'kubernetes.resources.configmapsSecrets.empty': 'ConfigMap または Secret がありません',
  'kubernetes.resources.configmapsSecrets.inaccessible': 'ConfigMap と Secret にアクセスできません',
  'kubernetes.resources.cronjobs.empty': 'CronJob がありません',
  'kubernetes.resources.cronjobs.inaccessible': 'CronJob にアクセスできません',
  'kubernetes.resources.deployments.empty': 'Deployment がありません',
  'kubernetes.resources.deployments.inaccessible': 'Deployment にアクセスできません',
  'kubernetes.resources.ingressesRoutes.empty': 'Ingress または Route がありません',
  'kubernetes.resources.ingressesRoutes.inaccessible': 'Ingress と Route にアクセスできません',
  'kubernetes.resources.jobs.empty': 'Job がありません',
  'kubernetes.resources.jobs.inaccessible': 'Job にアクセスできません',
  'kubernetes.resources.nodes.empty': 'ノードがありません',
  'kubernetes.resources.nodes.inaccessible': 'ノードにアクセスできません',
  'kubernetes.resources.nodes.permission': 'クラスターのノードを表示する権限がない可能性があります',
  'kubernetes.resources.pvcs.empty': 'PVC がありません',
  'kubernetes.resources.pvcs.inaccessible': 'PVC にアクセスできません',
  'kubernetes.resources.services.empty': 'Service がありません',
  'kubernetes.resources.services.inaccessible': 'Service にアクセスできません',
  'kubernetes.resources.delete': '{kind} を削除',
  'kubernetes.resources.deleteTitle': '{kind} を削除しますか？',
  'kubernetes.resources.deleteMessage': '{kind} {name} を削除してもよろしいですか？',
  'kubernetes.resources.deleteSelected': '選択した {count} 件を削除',
  'kubernetes.resources.selected': '{count} 件を選択中。',
  'kubernetes.resources.create': '作成',
  'kubernetes.resources.name': '名前',
  'kubernetes.resources.data': 'データ',
  'kubernetes.resources.details': '詳細',
  'kubernetes.resources.created': '作成日時',
  'kubernetes.resources.updated': '更新日時',
  'kubernetes.resources.containerEngine': 'コンテナーエンジン',
  'kubernetes.resources.engineName': 'エンジン名',
  'kubernetes.resources.engineId': 'エンジン ID',
  'kubernetes.resources.engineType': 'エンジンの種類',
  'kubernetes.resources.labels': 'ラベル',
  'kubernetes.resources.noLabels': 'ラベルなし',
  'kubernetes.resources.secrets.title': 'シークレット',
  'kubernetes.resources.secrets.create': 'シークレットを作成',
  'kubernetes.resources.secrets.name': 'シークレット名',
  'kubernetes.resources.secrets.data': 'シークレットのデータ',
  'kubernetes.resources.secrets.empty': 'シークレットがありません',
  'kubernetes.resources.secrets.emptyMessage': '次のコマンドで最初のシークレットを作成してください:',
  'kubernetes.resources.secrets.deleteTitle': 'シークレットを削除しますか？',
  'kubernetes.resources.secrets.deleteMessage': '{count} 件のシークレットを削除してもよろしいですか？',
  'kubernetes.resources.portForward.title': 'ポート転送',
  'kubernetes.resources.portForward.open': '転送ポートを開く',
  'kubernetes.resources.portForward.delete': '転送ポートを削除',
  'kubernetes.resources.portForward.deleteTitle': 'ポート転送を削除しますか？',
  'kubernetes.resources.portForward.deleteMessage': 'ポート転送を削除してもよろしいですか？',
  'kubernetes.resources.portForward.podDetails': 'Pod の詳細を開く',
  'kubernetes.resources.portForward.empty': 'ポート転送が設定されていません',
  'kubernetes.resources.portForward.emptyMessage':
    'ポートを転送するには、対象リソース (Pod、Service、Deployment) の概要タブを開いてください',
  'kubernetes.resources.condition.available': '利用可能',
  'kubernetes.resources.condition.unavailable': '利用不可',
  'kubernetes.resources.condition.updated': '更新済み',
  'kubernetes.resources.condition.newReplicaSet': '新しい ReplicaSet',
  'kubernetes.resources.condition.progressed': '進行済み',
  'kubernetes.resources.condition.scaledUp': 'スケールアップ済み',
  'kubernetes.resources.condition.scaledDown': 'スケールダウン済み',
  'kubernetes.resources.condition.deadlineExceeded': '期限超過',
  'kubernetes.resources.condition.replicaFailure': 'レプリカ障害',
  'kubernetes.resources.condition.completed': '完了',
  'kubernetes.resources.condition.failed': '失敗',
  'kubernetes.resources.condition.running': '実行中',
  'kubernetes.resources.condition.pending': '保留中',
  'kubernetes.resources.condition.unknown': '不明',
  'kubernetes.resources.role.controlPlane': 'コントロールプレーン',
  'kubernetes.resources.role.node': 'ノード',
};
