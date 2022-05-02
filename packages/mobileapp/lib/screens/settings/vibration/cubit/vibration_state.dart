part of 'vibration_cubit.dart';

enum VibrationType { onNewNoun, onVote }

@JsonSerializable()
class VibrationState extends Equatable {
  const VibrationState({
    this.onNewNoun = false,
    this.onVote = false,
  });

  final bool onNewNoun;
  final bool onVote;

  @override
  List<Object> get props => [
        onNewNoun,
        onVote,
      ];

  VibrationState copyWith({
    bool? onNewNoun,
    bool? onVote,
  }) {
    return VibrationState(
      onNewNoun: onNewNoun ?? this.onNewNoun,
      onVote: onVote ?? this.onVote,
    );
  }

  factory VibrationState.fromJson(Map<String, dynamic> json) =>
      _$VibrationStateFromJson(json);

  Map<String, dynamic> toJson() => _$VibrationStateToJson(this);
}
